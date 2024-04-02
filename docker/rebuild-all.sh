#!/bin/sh
#
# Rebuilds the docker images but without restarting containers
# Use:
#     ./rebuild-all.sh devnet
# or
#     ./rebuild-all.sh mainnet
#
export ENV=".env.$1"
cp -f -v $ENV .env

# first build base image
sudo docker build -t socialcap/services:base -f ./docker/base.Dockerfile .

# now build the runners images
sudo docker build -t socialcap/services:run -f ./docker/run.Dockerfile .
