[![npm (scoped)](https://img.shields.io/npm/v/@subfuzion/database.svg)](@subfuzion/database)
[![node (scoped)](https://img.shields.io/node/v/@subfuzion/queue.svg)](@subfuzion/queue)

# @subfuzion/queue

This is a simple queue package intended for a demo application used for
educational purposes.

It provides a Producer class for enqueueing messages and a Consumer class
for dequeueing them. 

The queue is implemented using [Redis](https://redis.io/) and this package
provides a trivial wrapper over the [ioredis](https://github.com/luin/ioredis)
client for Node. The wrapper essentially provides a minimal facade for using
a simple queue, and also serves to illustrate how to use and test basic
Redis operations using ES2017 async/await support now available natively
in Node.js.

This package is inspired by the existing [Docker Example Voting App](https://github.com/dockersamples/example-voting-app).
The existing app is an excellent example of a real world polyglot application, demonstrating
containerized processes created from a number of different programming languages. This
package is intended to support a simpler version of the voting application that only
uses Node.js and modern JavaScript that some developers may find a bit easier to follow while
trying to understand how the application actually works.

## Testing

Redis needs to be available before running tests. The tests default to
port 6379 on localhost, but host and port can be overridden by setting
HOST and PORT environment variables.

If you have [Docker](https://www.docker.com/) installed, you can easily
start Redis with the default values by running the following command:

    $ docker run -d -p 6379:6379 --name queue redis

This will run a redis container named queue in the background with port 6379
on your system mapped to the exposed port 6379 in the container.

To run the tests, enter the following:

    $ npm test

When finished, you can remove the running container from your system with:

    $ docker rm -f queue

## Using @subfuzion/queue

Add the dependency to your package:

npm:

    $ npm install @subfuzion/queue

yarn:

    $ yarn add @subfuzion/queue

### Enqueueing Messages

    var p = new Producer(topic [, config])
    await p.send(message)
    // when finished with the producer:
    await p.quit()
 
where `topic` should be the queue topic and `config` is an optional
object that can have `host` and `port` values.
 
### Dequeueing Messages

    var c = new Consumer(topic [, config])
    let message = await c.receive(topic)
    // when finished with the consumer: 
    await c.quit()

where `topic` and `config` are the same as described previously.

Note that the receive method blocks until there is a message ready to
be retrieved from the queue. The method will return null if the connection
is closed (by calling quit) while it is waiting.

### Closing Connections

You should always call quit on producers and consumers to ensure
connections are gracefully closed on both the client and server sides.



