FROM node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV REDIS_HOST $REDIS_HOST
ENV REDIS_PORT $REDIS_PORT
ENV MONGO_HOST $MONGO_HOST
ENV MONGO_PORT $MONGO_PORT

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENTRYPOINT [ "npm", "start" ]