#!/bin/sh
# Use:
#     ./restart-all.sh

if [ -z "$1" ]; then
    echo "Error: No branch provided."
    echo "Usage: $0 main"
    echo "   or: $0 dev"
    exit 1
fi

# will run the Socialcap API in host port 30800 
sudo sh ./deploy/restart-api.sh $1

# will run the Socialcap Sequencer with NO port
sudo sh ./deploy/restart-sequencer.sh $1
