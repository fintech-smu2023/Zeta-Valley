# Install app.
FROM node:18-alpine

# Create app directory.
WORKDIR /usr/local/src/app

# Build code for production.
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Used to restart app on crash.
RUN npm install -g pm2

# Bundle app source.
COPY . .

# Run app with pm2 monitoring.
CMD [ "pm2-runtime", "index.js" ]
