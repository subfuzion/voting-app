const assert = require('assert');
const axios = require('axios');
const Database = require('@subfuzion/database').Database;

suite('vote tests', () => {
  let ax = axios.create({
    baseURL: 'http://vote:3000/'
  });

  let votes_a = 3;
  let votes_b = 2;

  before(async function() {
    this.timeout(10 * 1000);

    let votes = [];
    for (let i = 0; i < votes_a; i++) {
      votes.push({ vote: 'a' });
    }
    for (let i = 0; i < votes_b; i++) {
      votes.push({ vote: 'b' });
    }

    votes.forEach(async v => {
      await ax.post('/vote', v);
    });

    // now we need to pause a while to make sure the worker has had time to
    // process the queue before we run database queries
    await pause(5 * 1000);
  });

  after(async () => {
    let dbConfig = Database.createStdConfig();
    let db = new Database(dbConfig);
    await db.connect();
    await db.instance.dropDatabase();
    await db.close();
  });

  test('tally votes', async() => {
    let resp = await ax.get('/results');
    assert.ok(resp.data.success);
    let tally = resp.data.result;
    assert.equal(tally.a, votes_a, `'a' => expected: ${votes_a}, actual: ${tally.a}`);
    assert.equal(tally.b, votes_b, `'b' => expected: ${votes_b}, actual: ${tally.b}`);
  });

});

async function pause(ms) {
  return new Promise(resolve => {
    console.warn(`pausing for ${ms} ms...`);
    setTimeout(resolve, ms);
  });
}