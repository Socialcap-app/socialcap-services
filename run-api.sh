#!/bin/sh

npm run build

export PORT=$1
node build/src/main-api.js $PORT
