#!/bin/sh

npm run build

export PORT=30800
node build/src/main-api.js $PORT
