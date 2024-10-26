#!/bin/sh
HOSTNAME=$(cat /etc/nginx/.hostname.txt)

sed "s/domain-name.com/${HOSTNAME}/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g 'daemon off;'
