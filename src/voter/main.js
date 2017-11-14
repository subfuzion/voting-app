const app = require('commander')
const inquirer = require('inquirer')
const pkg = require('./package.json')
const request = require('r2')

const voteURL = "http://localhost:3000/vote"
const resultsURL = "http://localhost:3000/results"

app
  .version(pkg.version)

app
  .command('vote')
  .description('vote for cats or dogs')
  .action(onVote)

app
  .command('results')
  .description('tally the votes')
  .action(onResults)

try {
  app.parse(process.argv)
} catch (err) {
  onError(err)
}

process.on('unhandledRejection', error => {
  onError('(unhandledRejection)', error)
})

function onError(msg, err) {
  console.log('error:', ...arguments)
}

// if no args, print help
if (!process.argv.slice(2).length) {
  app.outputHelp()
  console.log()
}

async function onVote(cmd, opts) {
  let q = {
    type: 'list',
    name: 'vote',
    message: 'What do you like better?',
    choices: ['(quit)', 'cats', 'dogs'],
    filter: val => val === '(quit)' ? 'q' : val === 'cats' ? 'a' : 'b'
  }
  let a = await inquirer.prompt(q)
  if (a.vote === 'q') process.exit()
  let res = await request.post(voteURL, { json: a }).json
  console.log(voteToString(res.result))
}

async function onResults(cmd, opts) {
  let res = await request.get(resultsURL).json
  console.log(tallyToString(res.result))
}

function voteToString(vote) {
  if (!vote) return `error: empty vote result`
  let id = vote.voter_id ? `${vote.voter_id}` : '?'
  let choice = vote.vote === 'a' ? 'cats' : 'dogs'
  return `Voter (id: ${id}) voted for: ${choice}`
}

function tallyToString(tally) {
  if (!tally) return `error: empty tally result`
  let winner = tally.a > tally.b ? 'CATS WIN!' : tally.b > tally.a ? 'DOGS WIN!' : 'IT\'S A TIE!'
  return `Total votes -> cats: ${tally.a}, dogs: ${tally.b} ... ${winner}`
}
