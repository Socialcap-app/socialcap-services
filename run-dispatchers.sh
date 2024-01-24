#!/bin/sh

npm run build

node build/src/main-dispatchers.js 3081 &

node build/src/main-dispatchers.js 3082 &
