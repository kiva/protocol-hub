#!/bin/bash

if [ $3 ]; then
    echo "This command only accepts two arguments: a JSON configuration file and, optionally, a string identify which environment configs to use"
    exit 99
fi

if [ -d build ]; then
    echo "Removing directory: build"
    rm -rf build
fi

CONFIG_FILE=""
DEPLOY_TARGET=""
CMD="npm run react-build"
NOTICE="BUILDING BUNDLE"

while [ "$1" != "" ]; do
    case $1 in
        *".json"*)
            echo "** Setting configuration file to $1"
            CONFIG_FILE=$1
            ;;
        * )
            echo "** Setting the environment to $1"
            DEPLOY_TARGET=$1
            NOTICE="$NOTICE FOR $DEPLOY_TARGET"
    esac
    shift
done

echo "============= $NOTICE ============="

npm rebuild node-sass

# Similar to problem in below Shell file, this will be run from root
sh ./tools/bundle/generate_static_files.sh $CONFIG_FILE $DEPLOY_TARGET

`echo $CMD`
