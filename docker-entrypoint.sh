#!/bin/sh
set -e

sed -i "s@{JWT_URL}@$JWT_URL@g" /etc/nginx/conf.d/nginx.conf
sed -i "s@{BACK_URL}@$BACK_URL@g" /etc/nginx/conf.d/nginx.conf

sed -i "s@{VITE_BACK_API_URL}@$VITE_BACK_API_URL@g" /app/build/assets/*.js
sed -i "s@{VITE_USERNAME_REGEX}@$VITE_USERNAME_REGEX@g" /app/build/assets/*.js

service nginx restart

sleep infinity