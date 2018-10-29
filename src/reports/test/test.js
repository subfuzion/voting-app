const assert = require('assert');
const axios = require('axios');
const Database = require('@subfuzion/database').Database;

suite('vote tests', () => {
  let ax = axios.create({
    baseURL: 'http://reports:3000/'
  });

  let votes_a = 3;
  let votes_b = 2;

  let db;

  before(async function() {
    this.timeout(10 * 1000);

    let dbConfig = Database.createStdConfig();
    db = new Database(dbConfig);
    await db.connect();

    // initialize test data
    let votes = [];
    for (let i = 0; i < votes_a; i++) {
      votes.push({ vote: 'a' });
    }
    for (let i = 0; i < votes_b; i++) {
      votes.push({ vote: 'b' });
    }

    await Promise.all(votes.map(vote => db.updateVote(vote)));
  });

  after(async () => {
    await db.instance.dropDatabase();
    await db.close();
  });

  test('tally votes', async () => {
    // test the reports results api
    let resp = await ax.get('/results');
    assert.ok(resp.data.success);
    let tally = resp.data.result;
    assert.equal(tally.a, votes_a, `'a' => expected: ${votes_a}, actual: ${tally.a}`);
    assert.equal(tally.b, votes_b, `'b' => expected: ${votes_b}, actual: ${tally.b}`);
  });

});

