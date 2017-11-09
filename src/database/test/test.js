const assert = require('assert')
const common = require('../lib/common')
const Database = require('../lib/Database')
const R = require('rambda')
const uuid = require('uuid/v1')

suite('database tests', () => {

  suite('basic mongo wrapper tests', () => {

    let db
    let dbname = `testdb_${uuid()}`

    before(async () => {
      // Get the defaults, but override with the generated database name
      // and HOST and PORT environment values, if provided.
      let config = common.DefaultConfig
      config.db = dbname
      config.host = process.env.HOST || config.host
      config.port = process.env.PORT || config.port

      db = new Database(config)
      assert.equal(db.connectionURL, `mongodb://${config.host}:${config.port}/${dbname}`)
      await db.connect()
      assert.equal(db.instance.databaseName, dbname)
      assert.equal(db.isConnected, true)
      assert.notEqual(db.instance, null)
    })

    after(async () => {
      await db.instance.dropDatabase()
      await db.close()
      assert.equal(db.isConnected, false)
      assert.equal(db.instance, null)
    })

    test('add vote to database', async () => {
      let v = {
        vote: 'a'
      }

      let doc = await db.updateVote(v)
      assert.ok(doc)
      assert.equal(doc.vote, v.vote)
      assert.notEqual(doc.voter_id, null)
    })

    test('missing vote property should throw', async () => {
      // invalid vote (must have vote property)
      let v = {}

      try {
        let doc = await db.updateVote(v)
        throw new Error('Expected an error for bad vote (missing vote property)')
      } catch (err) {
        if (!err.message.startsWith('Invalid vote')) {
          // rethrow unexpected error
          throw err
        }
      }
    })

    test('bad vote value should throw', async () => {
      // invalid value for vote (must be 'a' or 'b')
      let v = {
        vote: 'c'
      }

      try {
        let doc = await db.updateVote(v)
        throw new Error('Expected an error for invalid vote (bad value for vote')
      } catch (err) {
        if (!err.message.startsWith('Invalid vote')) {
          // rethrow unexpected error
          throw err
        }
      }
    })

    test('tally votes', async () => {
      // note: the total includes 1 vote for 'a' from a previous test, so
      // account for that by adding one less than the total
      let count_a = 4
      R.times(async () => {
        await db.updateVote({ vote: 'a' })
      }, count_a - 1)

      let count_b = 5
      R.times(async () => {
        await db.updateVote({ vote: 'b' })
      }, count_b)


      let tally = await db.tallyVotes()
      assert.ok(tally)
      assert.equal(tally.a, count_a, `'a' => expected: ${count_a}, actual: ${tally.a}`)
      assert.equal(tally.b, count_b, `'b' => expected: ${count_b}, actual: ${tally.b}`)
    })

  })

})
