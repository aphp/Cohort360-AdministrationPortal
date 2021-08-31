#!/usr/bin/bash

# @todo: remove the following line when cache is available
npm install && npm audit fix && CI=false npm run build

service nginx restart
sleep infinity