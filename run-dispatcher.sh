#!/bin/sh

npm run build

node build/src/main-dispatcher.js $1
