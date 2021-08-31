#!/usr/bin/bash

# @todo: remove the following line when cache is available
npm install && npm audit fix && CI=false npm run build
envsubst < /etc/nginx/sites-enabled/nginx.conf > nginx_conf && mv nginx_conf /etc/nginx/sites-enabled/nginx.conf

#envsubst < /etc/nginx/conf.d/nginx.conf > nginx_conf && mv nginx_conf /etc/nginx/conf.d/nginx.conf

service nginx restart
sleep infinity