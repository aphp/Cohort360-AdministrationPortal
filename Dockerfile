FROM node:20 AS build

COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.25.1

WORKDIR /app
COPY --from=build build build

# Configure the nginx inside the docker image
COPY docker/nginx.conf /etc/nginx/conf.d/

# Entrypoint script is used to replace environment variables
COPY ./docker-entrypoint.sh /app
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]