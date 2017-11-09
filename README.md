# UC Davis - Software Containerization with Docker for Developers

## Docker Voting App (Node.js version)

This app is inspired by the existing [Example Voting App](https://github.com/dockersamples/example-voting-app)
by [ManoMarks](https://github.com/dockersamples/example-voting-app) at Docker.

The existing app is an excellent example of a real world polyglot application, demonstrating
containerized processes created from a number of different programming languages. In
contrast, this app is meant to be slightly simpler version intended to support an introductory
course on Docker using only Node.js and modern JavaScript.

## Launching the app

The process is intentionally manual for the introduction course to allow gaining
familiarity with various processes. We will build on this until ultimately we have
a fully automated processes that starts the app services in a Docker swarm.

### Start a MongoDB container

MongoDB is a NoSQL database that we will use for storing votes. There is already
an existing image that we can use:

    $ docker run -d -p 27017:27017 --name mongodb mongodb

### Start a Redis container

Redis provides a fast in-memory data store that we will use as a queue. Votes will
be pushed to the queue, where workers will dequeue them asynchronously for saving
to the MongoDB database for subsquent query processing.

Like, MongoDB, there is already an existing image that we can use:

    $ docker run -d -p 6379:6379 --name queue redis

### Start a Vote Worker container

A vote worker pulls votes from the queue and saves them to the database for
subsequent query processing.

You will need to build the image first:

    $ cd worker
    $ docker build -t worker .

Then you can start it:

    $ docker run -d --name worker worker
    
### Start a Vote API container 

The `vote` service provides the API that clients will use to submit votes and fetch
voting tally results. The vote service receives votes that it then pushes to the
queue (where they will subsequently pulled by workers and saved to the database),
and it also queries the database to tally the votes. 

You will need to build the image first:

    $ cd vote
    $ docker build -t vote .

Then you can start it:

    $ docker run -d --name vote -p 3000:3000 vote

### Run a Vote client container

The `vote` app is a terminal program that you run to cast votes and fetch the
voting results.

    $ docker run -it --rm subfuzion/voter <cmd>

where <cmd> is either `vote` or `results` (if you don't enter any command,
then usage help will be printed to the terminal).


