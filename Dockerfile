#Primera Etapa
FROM node:16.3.0-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install --force

COPY . /app

RUN npm run build --prod

#Segunda Etapa
FROM nginxinc/nginx-unprivileged
	#Si estas utilizando otra aplicacion cambia front-inventario por el nombre de tu app
COPY --from=build-step /app/dist/front-inventario /usr/share/nginx/html
