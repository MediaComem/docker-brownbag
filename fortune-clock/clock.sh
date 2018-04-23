#!/bin/bash
trap "exit" SIGKILL SIGTERM SIGHUP SIGINT EXIT
while true; do
  echo It is $(date)
  /usr/games/fortune | /usr/games/cowsay
  echo
  sleep 5
done
