FROM node:12-stretch AS build

RUN apt-get update && apt-get install -y \
        g++ \
        git \
        make \
        python \
    && mkdir -p /usr/src/node_modules \
    && chown -R node:node /usr/src
WORKDIR /usr/src
COPY package*.json ./
USER node
RUN npm install


FROM node:12-alpine

RUN mkdir /app \
    && chown -R node:node /app
WORKDIR /app
COPY --from=build /usr/src .
COPY --chown=node:node . .
USER node
ENV DRSS_BOT_TOKEN='drss_docker_token' \
    DRSS_DATABASE_URI='mongodb://mongo:27017/rss' \
    DRSS_WEB_PORT=8080
CMD ["node", "server.js"]
