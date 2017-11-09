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

### Create an overlay network

After ensuring that swarm mode is enabled, create an overlay network that will be shared among the
services (for now, we will only create one):

    $ docker network create -d overlay --attachable demonet

### Start a MongoDB container

MongoDB is a NoSQL database that we will use for storing votes. There is already
an existing image that we can use:

    $ docker service create --name mongo -p 27017:27017 --network demonet mongo

### Start a Redis container

Redis provides a fast in-memory data store that we will use as a queue. Votes will
be pushed to the queue, where workers will dequeue them asynchronously for saving
to the MongoDB database for subsquent query processing.

Like, MongoDB, there is already an existing image that we can use:

    $ docker service create --name redis -p 6379:6379 --network demonet redis

### Start a Vote Worker container

A vote worker pulls votes from the queue and saves them to the database for
subsequent query processing.

You will need to build the image first:

    $ cd worker
    $ docker build -t worker .

Then you can start it:

    $ docker service create --name worker --network demonet worker
    
### Start a Vote API container 

The `vote` service provides the API that clients will use to submit votes and fetch
voting tally results. The vote service receives votes that it then pushes to the
queue (where they will subsequently pulled by workers and saved to the database),
and it also queries the database to tally the votes. 

You will need to build the image first:

    $ cd vote
    $ docker build -t vote .

Then you can start it:

    $ docker service create --name vote -p 3000:3000 --network demonet vote

### Run a Vote client container

The `vote` app is a terminal program that you run to cast votes and fetch the
voting results. We are running this as an interactive container in a terminal,
not a service, but since we created the overlay network with the `--attachable`
flag, we can share the network with the container so that it will be able to
access the vote api by DNS name.

    $ docker run -it --rm --network demonet subfuzion/voter demonet <cmd>

where <cmd> is either `vote` or `results` (if you don't enter any command,
then usage help will be printed to the terminal).

### Run the assessor

The `assessor` is for evaluating the performance of the Voting App
running under Docker. It works by monitoring the logs of each service
for patterns that must be matched to indicate success. The assessor
produces a report when complete or when the evaluation times out. 

