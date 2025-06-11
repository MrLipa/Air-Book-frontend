FROM node:24.2.0-slim

WORKDIR /usr/src/app
COPY ./../package*.json ./

RUN npm install
COPY ./../src ./

EXPOSE 3000

CMD ["npm", "run", "start"]
