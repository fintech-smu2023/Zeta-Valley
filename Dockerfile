# Install app.
FROM node:18-alpine

# Create app directory.
WORKDIR /usr/local/src/app

# Build code for production.
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Bundle app source.
COPY . .

# Run app.
CMD [ "npm", "start" ]
