FROM node:24.2.0-slim

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./
RUN npm install

COPY src ./src
COPY server.js .
COPY tsconfig.json .

EXPOSE 3000

CMD ["sh", "-c", "npm run ${NODE_ENV}"]
