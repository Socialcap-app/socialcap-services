# This is the image that runs a given service.
# Note that both the 'main-*' service to run and the port to use 
# are ENV vars that will be changed at 'docker run' time

# Use "base" image with all its requirements already installed
FROM socialcap/services:base

# this are default values, BUT will be changed on 'docker run'
ENV PORT=no-port
ENV MAIN=no-main

# run it
WORKDIR /services
CMD node build/src/$MAIN.js $PORT
