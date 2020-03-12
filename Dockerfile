FROM node:12-alpine
RUN apk add git && \
	mkdir -p /app/node_modules && \
    chown -R node:node /app
WORKDIR /app
# Copy the package.json first before copying app
COPY package*.json ./
USER node
# If package.json hasn't changed, Docker uses same image layer, and npm install will be skipped
# since Docker assumes output is the same as before
RUN npm install
# Copy the application from host machine directory argument of docker build to virtual machine
COPY . .
ENV DRSS_BOT_TOKEN='drss_docker_token' DRSS_DATABASE_URI='mongodb://mongo:27017/rss'
CMD ["node", "server.js"]
