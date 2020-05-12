FROM node:12-stretch AS build

RUN apt-get update && apt-get install -y \
        g++ \
        git \
        make \
        python \
    && mkdir -p /usr/src/node_modules \
    && chown -R node:node /usr/src
WORKDIR /usr/src
# Copy the package.json first before copying app
COPY package*.json ./
USER node
# If package.json hasn't changed, Docker uses same image layer, and npm install
# will be skipped since Docker assumes output is the same as before
RUN npm install


FROM node:12-alpine

RUN mkdir /app \
    && chown -R node:node /app
WORKDIR /app
COPY --from=build /usr/src .
# Copy the application from host machine directory argument of docker build
# to virtual machine
COPY --chown=node:node . .
USER node
ENV DRSS_BOT_TOKEN='drss_docker_token' \
    DRSS_DATABASE_URI='mongodb://mongo:27017/rss'
CMD ["node", "server.js"]
