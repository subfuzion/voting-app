FROM node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG REDIS_HOST
ARG REDIS_PORT
ENV REDIS_HOST ${REDIS_HOST:-redis}
ENV REDIS_PORT ${REDIS_PORT:-6379}

ARG MONGO_HOST
ARG MONGO_PORT
ENV MONGO_HOST ${MONGO_HOST:-mongo}
ENV MONGO_PORT ${MONGO_PORT:-27017}

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENTRYPOINT [ "npm", "start" ]