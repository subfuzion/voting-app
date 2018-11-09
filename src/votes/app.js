const express= require('express');
const http = require('http');
const morgan = require('morgan');
const Producer = require('@subfuzion/queue').Producer;

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

let queueConfig = Producer.createStdConfig();
let producer, db;

// route logging middleware
app.use(morgan('dev'));

// json body parsing middleware
app.use(express.json());

// root route handler
app.get('/', (req, res) => {
  return res.send({ success: true, result: 'hello'});
});

// vote route handler
app.post('/vote', async (req, res) => {
  try {
    console.log('POST /vote: %j', req.body);
    let v = req.body;
    await producer.send(v);
    console.log('queued :', v);
    // for now, just return the request body as the result
    res.send({ success: true, result: req.body });
  } catch (err) {
    console.log('ERROR: POST /vote: %j', err);
    res.send(500, { success: false, reason: err.message });
  }
});

// initialize and start running
(async () => {
  try {
    // initialize queue producer client for sending votes to the queue
    producer = new Producer('queue', queueConfig);
    producer.on('error', err => {
      console.log('queue error: ', err);
    });
    producer.on('connect', () => {
      console.log(`connected to queue (${queueConfig.host}:${queueConfig.port})`);
    });
    producer.on('close', () => {
      console.log(`queue connection closed (${queueConfig.host}:${queueConfig.port})`);
    });
    producer.on('reconnecting', () => {
      console.log(`reconnecting to queue (${queueConfig.host}:${queueConfig.port})`);
    });
    producer.on('end', () => {
      console.log(`queue connection end (${queueConfig.host}:${queueConfig.port})`);
    });

    await new Promise(resolve => {
      producer.on('ready', async() => {
        console.log(`queue connection ready (${queueConfig.host}:${queueConfig.port})`);
        server.listen(port, () => console.log(`listening on port ${port}`));
        resolve();
      });
    });

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

