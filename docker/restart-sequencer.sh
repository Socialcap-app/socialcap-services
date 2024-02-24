#!/bin/sh

# will run the Socialcap Sequencer with NO port
sudo docker rm $(sudo docker stop sc-sequencer)
sudo docker -l debug run -d --restart=always --name sc-sequencer \
  --net=host \
  --env MAIN=main-sequencer \
  --user $(id -u www-data):$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  -v /home/socialcap/kvstores:/kvstores \
  socialcap/services:run
