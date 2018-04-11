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

### Amazon ECS with Fargate

Deploy to [AWS ECS with Fargate](https://github.com/subfuzion/docker-voting-app-nodejs/wiki/Deploy-the-Docker-Voting-App-to-AWS-ECS-with-Fargate)

### GKE

Coming soon.

## About the Voting App

![Voting app architecture](https://raw.githubusercontent.com/subfuzion/docker-ucdavis-coursera/master/images/voting-app-arch-1.png)

This app is based on the original [Docker](https://docker.com) [Example Voting App](https://github.com/dockersamples/example-voting-app).

For more information, please see the [wiki](https://github.com/subfuzion/docker-voting-app-nodejs/wiki).

## Introduction to Docker Course

The app will be used for an introductory course called **Software Containerization
with Docker for Developers**.

The course will be offered through the [UC Davis Extension](https://extension.ucdavis.edu/online-learning) online program, available on [Coursera](https://www.coursera.org/) sometime in the spring of 2018.

See the [wiki](https://github.com/subfuzion/docker-voting-app-nodejs/wiki) for more
detail about course modules.

## License

The Voting App is open source and free for any use in compliance with the terms of the
[MIT License](https://github.com/subfuzion/docker-voting-app-nodejs/blob/master/LICENSE).

