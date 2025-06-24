FROM node:24.2.0-slim

WORKDIR /usr/src/app

COPY . ./

RUN npm install
RUN npm run build

FROM nginx:1.28.0

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
