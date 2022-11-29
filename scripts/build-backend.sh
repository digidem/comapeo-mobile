#!/bin/bash

set -eEu -o pipefail
shopt -s extdebug
IFS=$'\n\t'

trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

# Ensure we start in the right place
dir0="$( cd "$( dirname "$0" )" && pwd )"
repo_root="$(dirname "$dir0")"
cd "$repo_root"

echo "Setting up..."
mkdir -p ./nodejs-assets
rm -rf ./nodejs-assets/nodejs-project
rm -rf ./nodejs-assets/backend
if [ -f ./nodejs-assets/BUILD_NATIVE_MODULES.txt ]; then
  echo "Build Native Modules on"
else
  echo '1' >./nodejs-assets/BUILD_NATIVE_MODULES.txt
  echo "Set Build Native Modules on"
fi
cp -r ./src/backend ./nodejs-assets
mkdir -p ./nodejs-assets/nodejs-project/node_modules

echo "Installing dependencies..."
cd ./nodejs-assets/backend && npm ci

node 
