FROM node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG QUEUE_HOST
ARG QUEUE_PORT
ENV QUEUE_HOST ${QUEUE_HOST:-queue}
ENV QUEUE_PORT ${QUEUE_PORT:-6379}

ARG DATABASE_HOST
ARG DATABASE_PORT
ENV DATABASE_HOST ${DATABASE_HOST:-database}
ENV DATABASE_PORT ${DATABASE_PORT:-27017}

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENTRYPOINT [ "npm", "start" ]