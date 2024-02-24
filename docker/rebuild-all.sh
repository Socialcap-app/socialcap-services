#!/bin/sh
# Rebuilds the docker images but without restarting containers

# first build base image
sudo docker build -t socialcap/services:base -f ./docker/base.Dockerfile .

# now build the runners images
sudo docker build -t socialcap/services:run -f ./docker/run.Dockerfile .
