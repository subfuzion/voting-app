const Consumer = require('@subfuzion/queue').Consumer
const Database = require('@subfuzion/database').Database

// set queue connection timeout to 0 since we want the worker queue
// consumer to block indefinitely while waiting for messages
let queueOptions = {
  timeout: 0
}
let queueUri

if (process.env.REDIS_URI) {
  queueUri = process.env.REDIS_URI
} else {
  queueOptions.host = process.env.REDIS_HOST || process.env.QUEUE_HOST || 'localhost'
  queueOptions.port = process.env.QUEUE_PORT || 6379
}

let databaseOptions = {}
if (process.env.MONGO_URI) {
  databaseOptions.uri = process.env.MONGO_URI
} else {
  databaseOptions.host = process.env.DATABASE_HOST || 'localhost'
  databaseOptions.port = process.env.DATABASE_PORT || 27017
}

let consumer, db, quitting = false

// Set up signal handlers and open connections to database and queue.
async function init() {
  // Handle SIGTERM and SIGINT (ctrl-c) gracefully
  process.on('SIGTERM', async () => {
    console.log('worker received SIGTERM')
    // if already quitting then force quit
    if (quitting) {
      console.log('forcing quit now')
      process.exit()
    }
    await quit()
  })
  process.on('SIGINT', async () => {
    console.log('worker received SIGINT')
    // if already quitting then force quit
    if (quitting) {
      console.log('forcing quit now')
      process.exit()
    }
    await quit()
  })

  try {
    console.log('worker initializing')

    db = new Database(databaseOptions)
    await db.connect()
    console.log('connected to database')

    consumer = queueUri ? (new Consumer('queue', queueUri, queueOptions)) : (new Consumer('queue', queueOptions))
    consumer.on('error', err => {
      console.log(err.message)
      process.exit(1)
    })
    await new Promise(resolve => {
      consumer.on('ready', async() => {
        resolve()
      })
    })
    console.log('connected to queue')

    console.log('worker initialized')
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

// Quit gracefully by closing queue and database connections first.
async function quit() {
  // don't try to handle quit twice (for example, after a SIGTERM,
  // quit will be started; once the queue processing loops breaks
  // because the consumer connection gets closed here, it will also
  // call quit.
  if (quitting) return
  quitting = true
  console.log('worker stopping')
  //if (consumer) await consumer.end(true)
  if (consumer) await consumer.quit()
  // consumer no longer receiving messages from the queue, wait a bit
  // for any writes to db to complete
  if (db) {
    setTimeout(async () => {
      if (db) await db.close()
      console.log('worker stopped')
      process.exit()
    }, 500)
  } else {
    console.log('worker stopped')
    process.exit()
  }
}

// start worker
;(async () => {
  try {
    await init()
    console.log('worker processing queue')
    while (true) {
      try {
        let msg = await consumer.receive()
        console.log('message received: ', msg)
        let json = JSON.parse(msg)
        let res = await db.updateVote(json)
        console.log('message saved: %j', res)
      } catch (err) {
        console.log(err)
      }
    }
    console.log('worker stopped processing queue')
  } catch (err) {
    console.log(err)
  } finally {
    try {
      await quit()
    } catch (err) {
      console.log(err)
      process.exit(1)
    }
  }
})()

