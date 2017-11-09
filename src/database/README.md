[![npm version](https://badge.fury.io/js/%40subfuzion%2Fdatabase.svg)](https://badge.fury.io/js/%40subfuzion%2Fdatabase)

# @subfuzion/database

This is a simple database package intended for a demo application used for
educational purposes. It provides the ability to save and tally votes. 

It essentially provides a minimal facade for using MongoDB, and also serves to
illustrate how to use and test basic MongoDB operations using ES2017 async/await support
now available natively in Node.js.

The package uses [MongoDB](https://www.mongodb.com/) and the official
MongoDB [Node.js driver](http://mongodb.github.io/node-mongodb-native/2.2).
Votes are stored as documents in the votes collection of the voting database.

It is inspired by the existing [Docker Example Voting App](https://github.com/dockersamples/example-voting-app).
The existing app is an excellent example of a real world polyglot application, demonstrating
containerized processes created from a number of different programming languages. This
package is intended to support a simpler version of the voting application that only
uses Node.js and modern JavaScript that some developers may find a bit easier to follow while
trying to understand how the application actually works.

## Testing

MongoDB needs to be available before running tests. The tests default to
port the standard MongoDB port 27017 on localhost, but host and port can be overridden by setting
HOST and PORT environment variables.

If you have [Docker](https://www.docker.com/) installed, you can easily
start MongoDB with the default values by running the following command:

    $ docker run -d -p 27017:27017 --name mongodb mongodb

This will run a MongoDB container named mongodb in the background with port 27017
on your system mapped to the exposed port 27017 in the container.

To run the tests, enter the following:

    $ npm test

When finished, you can remove the running container from your system with:

    $ docker rm -f mongodb

## Using @subfuzion/database

Add the dependency to your package:

npm:

    $ npm install @subfuzion/database

yarn:

    $ yarn add @subfuzion/database

### Storing votes

    var db = new Database([options])
    let vote = { vote: 'a' } // valid values are 'a' or 'b'
    await db.updateVote(vote)
    // when finished with the database
    await db.close()
 
### Tallying votes

    var db = new Database([options])
    let tally = await db.tallyVotes()
    // tally is an object: { a: <number>, b: <number> }
    // when finished with the database
    await db.close()

