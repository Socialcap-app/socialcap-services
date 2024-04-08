#!/bin/sh
if [ -z "$1" ]; then
    echo "Error: No branch provided."
    echo "Usage: $0 main"
    echo "   or: $0 dev"
    exit 1
fi

export SOCIALCAP_HOME=socialcap-$1

# will run the Socialcap Sequencer with NO port
sudo docker rm $(sudo docker stop sc-sequencer)
sudo docker -l debug run -d --restart=always --name sc-sequencer \
  --net=host \
  --env MAIN=main-sequencer \
  --user $(id -u www-data):$(id -g www-data) \
  -v /etc/localtime:/etc/localtime:ro \
  -v /home/$SOCIALCAP_HOME/var:/var \
  socialcap/services:run
