# Base image
FROM node:20.12-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Persist the node_modules folder
VOLUME ./node_modules /usr/src/app/node_modules

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Copy environment file
COPY --chown=node:node .env ./

COPY --chown=node:node . .

ARG APP_ENV

# Use yarn with --from-lock-file flag
RUN yarn install --frozen-lockfile --network-timeout=30000

# Expose the port: 3001
EXPOSE 3001

# Build the app
RUN yarn build

# Run the app
CMD ["yarn", "start:prod"]