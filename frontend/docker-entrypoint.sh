#!/bin/sh
set -eu

: "${PORT:=80}"
: "${BACKEND_HOSTPORT:=backend:4000}"

export PORT
export BACKEND_HOSTPORT

envsubst '$PORT $BACKEND_HOSTPORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

