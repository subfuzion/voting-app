[![npm (scoped)](https://img.shields.io/npm/v/@subfuzion/auditor.svg)](@subfuzion/auditor) [![Docker Build Status](https://img.shields.io/docker/build/subfuzion/vote-auditor.svg)](subfuzion/vote-auditor)

# @subfuzion/auditor

This is the `auditor` for evaluating the performance of the
[Voting App](https://github.com/subfuzion/docker-voting-app-nodejs)
running under Docker. It works by monitoring the logs of each service
for patterns that must be matched to indicate success. The assessor
produces a report when complete or when the evaluation times out.

