#!/bin/sh
# ./run-worker-sh 01
# will run a Dispatcher in port 308${1}
export PORT=308${1}
export NAME=sc-dispatcher${1}

sudo docker rm $(docker stop $NAME)
sudo docker -l debug run -d --restart=always --name $NAME \
  --net=host \
  --env PORT=$PORT \
  --env MAIN=main-dispatcher \
  --user $(id -u www-data):$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  socialcap/services:run
