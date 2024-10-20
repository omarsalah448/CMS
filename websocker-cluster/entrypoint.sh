#!/bin/bash
set -e

# Function to wait for PostgreSQL to be ready
wait_for_db() {
  until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME"; do
    >&2 echo "Postgres is unavailable - waiting..."
    sleep 2
  done
  >&2 echo "Postgres is up - continuing..."
}

# Wait for the database to be ready
wait_for_db

# Remove a potentially pre-existing server.pid for Rails.
rm -f /myapp/tmp/pids/server.pid

# Try migrating the database, or create it if it doesn't exist
rails db:migrate 2>/dev/null || rails db:create db:migrate

# Execute the container's main process (the command passed to CMD in the Dockerfile)
exec "$@"
