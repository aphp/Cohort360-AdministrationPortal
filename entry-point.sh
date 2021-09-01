#!/usr/bin/bash

# @todo: remove the following line when cache is available
npm install && npm audit fix && CI=false npm run build

declare -a UrlArray=("JWT_URL" "PORTAIL_URL")

for NAME in ${UrlArray[@]}; do
  ENV_VAR="${!NAME}"
  ENV_VAR=$(echo $ENV_VAR | sed "s/[^a-zA-Z0-9]/\\\\&/g");
  sed -i s/"{{"$NAME"}}"/$ENV_VAR/g /etc/nginx/sites-enabled/nginx.conf;
#  sed -i s/"{{"$NAME"}}"/$ENV_VAR/g /etc/nginx/conf.d/nginx.conf;
done

service nginx restart

sleep infinity