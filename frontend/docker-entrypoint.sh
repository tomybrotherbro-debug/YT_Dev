#!/bin/sh
set -eu

: "${PORT:=80}"
: "${BACKEND_HOSTPORT:=backend:4000}"

# If Render injects only the hostname, default to port 4000.
case "$BACKEND_HOSTPORT" in
  *:*) ;;
  *) BACKEND_HOSTPORT="${BACKEND_HOSTPORT}:4000" ;;
esac

export PORT
export BACKEND_HOSTPORT

envsubst '$PORT $BACKEND_HOSTPORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

