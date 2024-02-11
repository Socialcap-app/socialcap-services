#!/bin/sh

# first build base image
sudo docker build -t socialcap/services:base -f ./docker/base.Dockerfile .

# now build the runners images
sudo docker build -t socialcap/services:run -f ./docker/run.Dockerfile .

# will run the Socialcap API in host port 30800 
sudo docker rm $(docker stop sc-api)
sudo docker -l debug run -d --restart=always --name sc-api \
  --net=host \
  --env PORT=30800 \
  --env MAIN=main-api \
  --user $(id -u www-data):$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  socialcap/services:run

# will run the Socialcap Sequencer with NO port
sudo docker rm $(docker stop sc-sequencer)
sudo docker -l debug run -d --restart=always --name sc-sequencer \
  --net=host \
  --env MAIN=main-sequencer \
  --user $(id -u www-data):$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  -v /home/socialcap/kvstores:/kvstores \
  socialcap/services:run

# will run Dispatcher worker in port 30801 to 30899
sudo sh ./docker/restart-worker.sh 01
sudo sh ./docker/restart-worker.sh 02
