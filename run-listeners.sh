#!/bin/sh

npm run build

node build/src/listeners/nats-listener.js
