const Database = require('@subfuzion/database').Database
const express= require('express')
const http = require('http')
const morgan = require('morgan')
const Producer = require('@subfuzion/queue').Producer

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

let queueOptions = {
  host: process.env.QUEUE_HOST || 'localhost',
  port: process.env.QUEUE_PORT || 6379
}

let databaseOptions = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 27017
}

let producer, db

// route logging middleware
app.use(morgan('dev'))

// json body parsing middleware
app.use(express.json())

// root route handler
app.get('/', (req, res) => {
  return res.send({ success: true, result: 'hello'})
})

// vote route handler
app.post('/vote', async (req, res) => {
  try {
    console.log('/vote: %j', req.body)
    await producer.send(req.body)
    console.log('queued %j', req.body)
    // for now, just return the request body itself as the result
    res.send({ success: true, result: req.body })
  } catch (err) {
    console.log('ERROR /vote: %j', err)
    res.send(500, { success: false, reason: err.message })
  }
})

// results route handler
app.get('/results', (req, res) => {
  res.send({ success: true, result: { a: 4, b: 5 }})
})

// initialize and start running
;(async () => {
  try {
    // initialize database client for querying vote results
    db = new Database(databaseOptions)
    await db.connect()
    console.log(`connected to database (${databaseOptions.host}:${databaseOptions.port})`)

    // initialize queue producer client for sending votes to the queue
    producer = new Producer('queue', queueOptions)
    producer.on('error', err => {
      console.log('queue error: ', err)
    })
    producer.on('connect', () => {
      console.log(`connected to queue (${queueOptions.host}:${queueOptions.port})`)
    })
    producer.on('ready', () => {
      console.log(`queue connection ready (${queueOptions.host}:${queueOptions.port})`)
    })
    producer.on('close', () => {
      console.log(`queue connection closed (${queueOptions.host}:${queueOptions.port})`)
    })
    producer.on('reconnecting', () => {
      console.log(`reconnecting to queue (${queueOptions.host}:${queueOptions.port})`)
    })
    producer.on('end', () => {
      console.log(`queue connection end (${queueOptions.host}:${queueOptions.port})`)
    })

    server.listen(port, () => console.log(`listening on port ${port}`))

  } catch (err) {
    console.log(err)
  }
})()

