FROM harbor.eds.aphp.fr/cohort360/nginx:{{ENVIR}}

WORKDIR /app
COPY package.json tsconfig.json entry-point.sh ./
COPY src src
COPY public public
COPY build build

COPY nginx.conf /etc/nginx/conf.d/
CMD ["bash", "entry-point.sh"]

