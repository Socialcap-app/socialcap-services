#!/bin/sh
# Use:
#     ./restart-all.sh devnet
#     ./restart-all.sh mainnet
export ENV=".env.$1"

# first build base images
sudo sh ./docker/rebuild-all.sh $ENV

# will run the Socialcap API in host port 30800 
sudo sh ./docker/restart-api.sh

# will run the Socialcap Sequencer with NO port
sudo sh ./docker/restart-sequencer.sh
