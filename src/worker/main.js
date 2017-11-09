const Consumer = require('@subfuzion/queue').Consumer
const Database = require('@subfuzion/database')

let redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
}

let mongoOptions = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017
}

let consumer, database, db

async function init() {
  console.log('worker initializing')
  database = new Database(mongoOptions)
  db = await database.connect()
  consumer = new Consumer('queue', redisOptions)
  console.log('worker initialized')
}

async function quit() {
  console.log('worker quitting')
  await consumer.quit()
  await db.close()
  console.log('worker quit')
}

async function main() {
  await init()
  console.log('worker processing queue')
  while (true) {
    let msg = await consumer.receive()
    console.log('message received: %j', msg)
    if (!msg) break;
    let res = await db.vote(msg)
    console.log('message saved: %j', res)
  }
  console.log('worker finished processing queue')
}

main().catch(err => {
  console.log(err)
}).finally(async () => {
  try {
    await quit()
  } catch (err) {
    console.log(err)
  }
})

// TODO handle signals

