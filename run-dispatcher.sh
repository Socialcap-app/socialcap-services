#!/bin/sh

npm run build

node build/src/main-dispatchers.js $1
