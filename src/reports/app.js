const Database = require('@subfuzion/database').Database;
const express= require('express');
const http = require('http');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

let databaseConfig = Database.createStdConfig();
let db;

// install route logging middleware
app.use(morgan('dev'));

// install json body parsing middleware
app.use(express.json());

// root route handler
app.get('/', (req, res) => {
  return res.send({ success: true, result: 'hello'});
});

// results route handler
app.get('/results', async (req, res) => {
  try {
    console.log('GET /results');
    let result = await db.tallyVotes();
    console.log('results: %j', result);
    res.send({ success: true, result: result });
  } catch (err) {
    console.log('ERROR GET /results: %j', err);
    res.send(500, { success: false, reason: err.message });
  }
});

// initialize and start running
(async () => {
  try {
    // initialize database client for querying vote results
    db = new Database(databaseConfig);
    await db.connect();
    console.log(`connected to database (${db.connectionURL})`);
    server.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

