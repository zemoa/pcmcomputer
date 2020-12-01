FROM nginx:1.19.4-alpine

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
CMD mkdir -p /www
COPY dist/pcmcomputer-web /www

CMD /bin/sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf" && nginx -g 'daemon off;'
