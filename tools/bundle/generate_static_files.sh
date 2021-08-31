#!/bin/bash

CONFIG_FILE=$1
BUILD_TYPE=$2

if [ ! -d src/constants ]; then
    echo "Making a ./src/constants directory...\n"
    mkdir -p src/constants
    echo "Done!\n"
fi

node ./tools/bundle/Build.js $CONFIG_FILE $BUILD_TYPE