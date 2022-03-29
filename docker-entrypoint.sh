#!/bin/sh
set -e

sed -i "s@{JWT_URL}@$JWT_URL@g" /etc/nginx/conf.d/nginx.conf
sed -i "s@{BACK_URL}@$BACK_URL@g" /etc/nginx/conf.d/nginx.conf

sed -i "s@{BACK_API_URL}@$BACK_API_URL@g" /app/build/static/js/*.js

service nginx restart

sleep infinity