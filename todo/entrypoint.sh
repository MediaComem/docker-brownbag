#!/usr/bin/env sh
command -v nc &>/dev/null || { >&2 echo "This script requires the 'nc' command (from netcat-openbsd)"; exit 2; }
command -v seq &>/dev/null || { >&2 echo "This script requires the 'seq' command (from coreutils)"; exit 2; }

attempts=${ATTEMPTS:-60}
host=${DATABASE_HOST:-"db"}
port=${DATABASE_PORT:-"27017"}

for n in `seq 1 $attempts`; do
  if nc -z -w 1 $host $port; then
    break
  elif test $n -eq $attempts; then
    exit 1
  fi

  echo "Attempting to connect to database on ${host}:${port} ($n)..."
  sleep 1
done

exec "$@"
