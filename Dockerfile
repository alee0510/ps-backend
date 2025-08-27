# BUILD STAGE
FROM node:20-alpine AS base

# set working directory
WORKDIR /app

# install dependencies
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

# copy src code
COPY src ./src
COPY tsconfig.json ./

# generate prisma client
RUN npx prisma generate

# build the project
RUN npm run build

# remove dev dependencies
RUN npm prune --production


# PRODUCTION STAGE
FROM node:20-alpine AS prodcution
WORKDIR /app

# copy only needed files from build stage
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package*.json ./
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/dist ./dist

# generate prisma client
RUN npx prisma generate

# set environment variables
ENV NODE_ENV=production
ENV PORT=2000
ENV DATABASE_URL=$DATABASE_URL
ENV JWT_SECRET=$JWT_SECRET
ENV GMAIL_APP_PASSWORD=$GMAIL_APP_PASSWORD
ENV GMAIL_USER=$GMAIL_USER
ENV CLOUD_NAME=$CLOUD_NAME
ENV CLOUD_API_KEY=$CLOUD_API_KEY
ENV CLOUD_API_SECRET=$CLOUD_API_SECRET

# expose port
EXPOSE 2000

# start the server
CMD ["node", "dist/server.js"]