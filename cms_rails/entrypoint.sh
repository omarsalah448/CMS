#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

rails db:migrate 2>/dev/null || rails db:create db:migrate

exec "$@"