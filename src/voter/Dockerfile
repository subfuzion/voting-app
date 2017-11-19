FROM node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

ARG VOTE_API_HOST
ARG VOTE_API_PORT
ENV VOTE_API_HOST ${VOTE_API_HOST:-vote}
ENV VOTE_API_PORT ${VOTE_API_PORT:-3000}

COPY package.json /usr/src/app/
RUN npm install && npm cache clean --force
COPY . /usr/src/app

ENTRYPOINT [ "npm", "start" ]