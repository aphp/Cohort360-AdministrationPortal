#!/usr/bin/bash

# @todo: remove the following line when cache is available
npm install && npm audit fix && CI=false npm run build
sed -i s/{{JWT_SERVER}}/$JWT_SERVER/g /etc/nginx/sites-enabled/nginx.conf
sed -i s/{{PORTAIL_SERVER}}/$PORTAIL_SERVER/g /etc/nginx/sites-enabled/nginx.conf

#sed -i s/{{JWT_SERVER}}/$JWT_SERVER/g /etc/nginx/conf.d/nginx.conf
#sed -i s/{{PORTAIL_SERVER}}/$PORTAIL_SERVER/g /etc/nginx/conf.d/nginx.conf

service nginx restart
sleep infinity