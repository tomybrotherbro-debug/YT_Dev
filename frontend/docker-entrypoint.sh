#!/bin/sh
set -eu

: "${BACKEND_HOSTPORT:=backend:4000}"
export BACKEND_HOSTPORT

envsubst '$BACKEND_HOSTPORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

