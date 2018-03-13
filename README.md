# Docker Voting App (Node.js version)

## Build Status

| Service  | Docker Image           | Build Status |
|:---------|:-----------------------|:-------------|
| API      | subfuzion/vote-api     | [![Docker build](https://img.shields.io/docker/build/subfuzion/vote-api.svg)](https://hub.docker.com/r/subfuzion/vote-api/)
| Worker   | subfuzion/vote-worker  | [![Docker build](https://img.shields.io/docker/build/subfuzion/vote-worker.svg)](https://hub.docker.com/r/subfuzion/vote-worker/)
| Auditor  | subfuzion/vote-auditor | [![Docker build](https://img.shields.io/docker/build/subfuzion/vote-auditor.svg)](https://hub.docker.com/r/subfuzion/vote-auditor/)
| Database | Mongo | [![Docker build](https://img.shields.io/docker/pulls/_/mongo.svg)](https://hub.docker.com/_/mongo/)
| Queue | Redis | [![Docker build](https://img.shields.io/docker/pulls/_/redis.svg)](https://hub.docker.com/_/redis/)

| Node.js Packages    | npm                    | Build Status |
|:--------------------|:-----------------------|:------------ |
| @subfuzion/database | [![npm (scoped)](https://img.shields.io/npm/v/@subfuzion/database.svg)](@subfuzion/database) | [![Travis](https://img.shields.io/travis/subfuzion/docker-voting-app-nodejs.svg)](https://travis-ci.org/subfuzion/docker-voting-app-nodejs)
| @subfuzion/queue    | [![npm (scoped)](https://img.shields.io/npm/v/@subfuzion/queue.svg)](@subfuzion/queue) | [![Travis](https://img.shields.io/travis/subfuzion/docker-voting-app-nodejs.svg)](https://travis-ci.org/subfuzion/docker-voting-app-nodejs)

## Quick Start

Get Docker for free from the [Docker Store](https://www.docker.com/community-edition#/download).
This app will work with versions from either the Stable or the Edge channels.

> If you're using [Docker for Windows](https://docs.docker.com/docker-for-windows/) on Windows 10 pro or later, you must also switch to [Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers).

Run in this directory:

    $ docker-compose up

You can test it with the `voter` CLI:

```
$ docker run -it --rm --network=host subfuzion/voter vote
? What do you like better? (Use arrow keys)
  (quit)
❯ cats
  dogs
```

You can print voting results:

```
$ docker run -it --rm --network=host subfuzion/voter results
Total votes -> cats: 4, dogs: 0 ... CATS WIN!
```

When you are finished:

Press `Ctrl-C` to stop the stack, then enter:

    $ docker-compose -f docker-compose.yml rm -f

### Docker Swarm

You can also run it on a [Docker Swarm](https://docs.docker.com/engine/swarm/).
If you haven't initialized one yet, run:

    $ docker swarm init

Once you have initialized a swarm, then deploy the stack:

    $ docker stack deploy --compose-file docker-stack.yml vote

You can test it the same way as described for docker-compose. When finished, you
can stop the stack by entering:

    $ docker stack rm vote

### Kubernetes

Kubernetes and Helm chart support has been added to the repo. Instructions coming
soon.

### Docker Cloud

Coming soon.

### Amazon ECS with Fargate

Deploy to [AWS ECS with Fargate](https://github.com/subfuzion/docker-voting-app-nodejs/wiki/Deploy-the-Docker-Voting-App-to-AWS-ECS-with-Fargate)

## About the Voting App

![Voting app architecture](https://raw.githubusercontent.com/subfuzion/docker-ucdavis-coursera/master/images/voting-app-arch-1.png)

This app is based on the original [Docker](https://docker.com) [Example Voting App](https://github.com/dockersamples/example-voting-app).

### Goals

The goal is to provide a demonstration and orientation to Docker, covering a
range of concepts and tasks for building, deploying and monitoring an application.

Orchestration concepts and tasks will also be showcased here, including the use of
[Docker Swarm mode](https://docs.docker.com/engine/swarm/) and
[Kubernetes](https://kubernetes.io/).

Real world production concerns, such as monitoring, rolling updates, etc., will also be introduced.

Finally, the application will be used to demonstrate evolving Cloud-native concepts,
such as service meshes.

## Introduction to Docker Course

The app will be used for an introductory course called **Software Containerization
with Docker for Developers**.

The course will be offered through the [UC Davis Extension](https://extension.ucdavis.edu/online-learning) online program, available on [Coursera](https://www.coursera.org/) sometime in spring of 2018.

See the [wiki](https://github.com/subfuzion/docker-voting-app-nodejs/wiki) for more
detail about course modules.

### Rationale for this implementation

The original app is a great demonstration of how Docker can be used to containerize
any process of a modern polyglot application, regardless of the programming language
used and runtime environment needed for each one. From a devops perspective, this is
a compelling example of Docker's benefits.

However, if you are a developer who is also interested in hacking on the application
a bit to experiment with it as well as to extend your knowledge around Docker, then
the use of so many different languages can pose a slight barrier. This version of the
app has been developed to support an introductory course on Docker and is meant to be
slighly easier to hack on for just that reason.

It's hard to pick a single language that will please everyone. The decision was made
to settle on [Node.js](https://nodejs.org/) due to its popularity for API development and because of the number of programmers who have had some exposure to [JavaScript](https://www.javascript.com/).

While JavaScript has its quirks, the code for the various packages in this example
are written using the latest EcmaScript support that is available in LTS (`8.0+`) and
later versions of Node (See [node.green](http://node.green/)). In particular, the use
of [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) should make control flow somewhat easier to follow for developers not as familiar with Node asynchronous
callback conventions.

As modest as the app is in terms of actual functionality (it only supports casting
votes and querying the vote tally), it has nevertheless been designed to reflect principles of modern [12-Factor Apps](https://12factor.net/) well suited to showcasing Docker's benefits.

## License

The Voting App is open source and free for any use in compliance with the terms of the
[MIT License](https://github.com/subfuzion/docker-voting-app-nodejs/blob/master/LICENSE).

