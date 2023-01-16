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
dir0="$(cd "$(dirname "$0")" && pwd)"
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
cd ./nodejs-assets/backend
# The install / postinstall scripts for backend dependencies are currently all
# for generating / downloading builds of native modules. Because we are
# re-building native modules anyway (for Android/iOS), we don't need to run
# these scripts.
npm ci --ignore-scripts
# Setting --ignore-scripts above means that the postinstall script will not run
# (needed for patch-package)
npm run postinstall

echo -en "Creating bundle..."
npm run build
cd ../..
echo -en " done.\n"

echo -en "Keeping whitelisted files..."
declare -a keepThese=("package.json" "index.bundle.js" "loader.js")
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/backend/$x" ]; then
    mv "./nodejs-assets/backend/$x" "./nodejs-assets/nodejs-project/$x"
  fi
done

# Rename index.bundle.js to index.js after it's moved to nodejs-project/
mv "./nodejs-assets/nodejs-project/index.bundle.js" "./nodejs-assets/nodejs-project/index.js"
echo -en " done.\n"

echo -en "Keeping some node modules..."
declare -a keepThese=(
  # We need to leave this in place so that nodejs-mobile finds it and builds it
  ".bin"
  "better-sqlite3"
  "crc-universal"
  "fs-native-extensions"
  "napi-build-utils"
  "napi-macros"
  "node-gyp-build"
  "quickbit-universal"
  "simdle-universal"
  # "sodium-native"
  "udx-native"
)
for x in "${keepThese[@]}"; do
  if [ -e "./nodejs-assets/backend/node_modules/$x" ]; then
    dest="./nodejs-assets/nodejs-project/node_modules/$x"
    mkdir -p "${dest%/*}"
    mv "./nodejs-assets/backend/node_modules/$x" "${dest}"
  fi
done
echo -en " done.\n"

# Reduce apk size by removing prebuild/ directories found in native deps
find "./nodejs-assets/nodejs-project/node_modules" -type d -name 'prebuilds' -exec rm -rf {} +

# echo -en "Removing unused .bin aliases..."
find "./nodejs-assets/nodejs-project/node_modules/.bin" ! -iname "node-gyp-build*" \( -type f -o -type l \) -exec rm -f {} +
# echo -en " done.\n"

echo -en "Cleanup..."
rm -rf ./nodejs-assets/backend
echo -en " done.\n"
