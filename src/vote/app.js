const express= require('express')
const http = require('http')
const morgan = require('morgan')
const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)

// initialize queue producer client
const Producer = require('@subfuzion/queue').Producer
const producer = new Producer()

// initialize database client
const Database = require('@subfuzion/database').Database
const db = new Database()

// install route logging middleware
app.use(morgan('dev'))

// install json body parsing middleware
app.use(express.json())

// install route handlers

app.get('/', (req, res) => {
  return res.send({ success: true, result: 'hello'})
})

app.post('/vote', (req, res) => {
  res.send({ success: true, result: req.body})
})

app.get('/results', (req, res) => {
  res.send({ success: true, result: { a: 4, b: 5 }})
})

// start listening
server.listen(port, () => console.log(`listening on port ${port}`))

