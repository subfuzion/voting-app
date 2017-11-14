const Database = require('@subfuzion/database').Database
const express= require('express')
const http = require('http')
const morgan = require('morgan')
const Producer = require('@subfuzion/queue').Producer

const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)

let redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
}

let mongoOptions = {
  host: process.env.MONGO_HOST || 'localhost',
  port: process.env.MONGO_PORT || 27017
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
    producer = new Producer(redisOptions)
    console.log(`connected to queue at ${redisOptions.host}:${redisOptions.port}`)

    // initialize database client
    db = new Database(mongoOptions)
    await db.connect()
    console.log(`connected to database at ${mongoOptions.host}:${mongoOptions.port}`)

    // start listening
    server.listen(port, () => console.log(`listening on port ${port}`))

  } catch (err) {
    console.log(err)
  }
})()

