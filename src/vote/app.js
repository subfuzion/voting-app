const Database = require('@subfuzion/database').Database
const express= require('express')
const http = require('http')
const morgan = require('morgan')
const Producer = require('@subfuzion/queue').Producer

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

let queueOptions = {
  host: process.env.QUEUE_HOST || 'queue',
  port: process.env.QUEUE_PORT || 6379
}

let databaseOptions = {
  host: process.env.DATABASE_HOST || 'database',
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
app.post('/vote', (req, res) => {
  try {
    console.log('/vote: %j', req.body)
    producer.send(req.body)
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
    // initialize queue producer client
    producer = new Producer(queueOptions)
    console.log(`connected to queue at ${queueOptions.host}:${queueOptions.port}`)
    producer.on('error', err => {
      console.log('[queue]', err)
    })

    // initialize database client
    db = new Database(databaseOptions)
    await db.connect()
    console.log(`connected to database at ${databaseOptions.host}:${databaseOptions.port}`)

    // start listening
    server.listen(port, () => console.log(`listening on port ${port}`))

  } catch (err) {
    console.log(err)
  }
})()

