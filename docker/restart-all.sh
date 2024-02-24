#!/bin/sh

# first build base images
shdi sh ./docker/rebuild-all.sh

# will run the Socialcap API in host port 30800 
sudo sh ./docker/restart-api.sh

# will run the Socialcap Sequencer with NO port
sudo sh ./docker/restart-sequencer.sh

# will run Dispatcher workers in port 30801 to 30899
sudo sh ./docker/restart-worker.sh 01
sudo sh ./docker/restart-worker.sh 02
