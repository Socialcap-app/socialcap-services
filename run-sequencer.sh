#!/bin/sh

npm run build

node build/src/sequencer/main-sequencer.js
