#!/bin/sh
# Use:
#     ./restart-all.sh

# will run the Socialcap API in host port 30800 
sudo sh ./docker/restart-api.sh

# will run the Socialcap Sequencer with NO port
sudo sh ./docker/restart-sequencer.sh
