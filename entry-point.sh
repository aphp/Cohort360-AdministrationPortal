#!/usr/bin/bash

# remove the following line when cache is available
npm install && npm audit fix && CI=false npm run build

service nginx restart
sleep infinity