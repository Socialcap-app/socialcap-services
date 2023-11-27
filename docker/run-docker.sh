#!/bin/sh

# first build it
sudo docker build -t socialcap/api:run -f ./docker/Dockerfile .

# stop and remove previous container
sudo docker rm $(docker stop scapi)

# will run the Socialcap API in host port 3080 
sudo docker -l debug run -d --restart=always --name scapi \
  --net=host \
  --user $(id -u www-data):$(id -g www-data) \
  --env USER=www-data \
  --env GROUP=www-data \
  --env UID=$(id -u www-data) \
  --env GID=$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  socialcap/api:run
