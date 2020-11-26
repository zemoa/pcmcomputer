FROM nginx:1.19.4-alpine

COPY nginx-custom.conf /etc/nginx/conf.d/default.conf
COPY dist/* /usr/share/nginx/html

EXPOSE 80
