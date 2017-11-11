const Consumer = require('@subfuzion/queue').Consumer
const Database = require('@subfuzion/database').Database

// set redis connection timeout to 0 since we want the worker queue
// consumer to block indefinitely while waiting for messages
let redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  timeout: 0
}

let mongoOptions = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017
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

  console.log('worker initializing')

  db = new Database(mongoOptions)
  await db.connect()

  consumer = new Consumer('queue', redisOptions)
  console.log('worker initialized')
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
(async () => {
  try {
    await init()
    console.log('worker processing queue')
    while (true) {
      try {
        let m = await consumer.receive()
        if (!m) break;
        let j = JSON.parse(m)
        console.log('message received: %j', j)
        let res = await db.updateVote(j)
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
    }
  }
})()

