#!/bin/sh
# runs the given test code
# must be in the src/tests folder and only give name wo extension
npm run build
node build/src/tests/$1.js
