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

# all this to install yarn and deal with prerequisites and warnings...
# note: will see one warning about delaying configuration until after apt-utils is installed (ironically)
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        apt-utils \
        apt-transport-https \
        ca-certificates
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        yarn

COPY package.json /usr/src/app/
RUN yarn install && yarn cache clean
COPY . /usr/src/app

EXPOSE 3000

ENTRYPOINT [ "npm" ]
CMD [ "start" ]

