#!/bin/bash

### Debug script to replicate steps taken by NodeJS Mobile React Native (see its android/build.gradle)
### Intended to only work on a single module at a time
### Takes two arguments:
### 1. Module name e.g. better-sqlite3
### 2. ABI name e.g. arm64-v8a

set -eEu -o pipefail
shopt -s extdebug extglob
IFS=$'\n\t'

trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

ROOT_PROJECT_PROJECT_DIR="$(pwd)/android"
ROOT_PROJECT_BUILD_DIR="$ROOT_PROJECT_PROJECT_DIR/build"
PROJECT_PROJECT_DIR="$(pwd)/node_modules/nodejs-mobile-react-native/android"

##################################################################

### 0. Parse args

MODULE=$1
abi_name=$2

echo -e "Building native modules for \"$MODULE\" ($abi_name)\n"

### 1. CopyNodeProjectAssetsFolder

echo -e "(1) Starting task CopyNodeProjectAssetsFolder\n"

mkdir -p $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project

cp -fR $ROOT_PROJECT_PROJECT_DIR/../nodejs-assets/nodejs-project/ \
  $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/

rm -rf $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/**/*\~ &&
  rm -rf $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/**/\.* &&
  rm -rf $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/**/*.gz

### 2. ApplyPatchScriptToModules

echo -e "(2) Starting task ApplyPatchScriptToModules\n"

npmCommandName='npm'
nodeCommandName='node'

if [[ "$OSTYPE" == "darwin"* ]]; then
  commandResult=$(command -v npm)

  if [[ $? -ne 0 ]]; then
    npmCommandName='../build-native-modules-MacOS-helper-script-npm.sh'
  fi

  commandResult=$(command -v node)

  if [[ $? -ne 0 ]]; then
    nodeCommandName='../build-native-modules-MacOS-helper-script-node.sh'
  fi
fi

if [[ "$OSTYPE" == "darwin"* ]]; then
  cp $ROOT_PROJECT_PROJECT_DIR/../nodejs-assets/build-native-modules-MacOS-helper-script-node.sh \
    $ROOT_PROJECT_BUILD_DIR/nodejs-assets
fi

cd $ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/

$nodeCommandName "$PROJECT_PROJECT_DIR/../scripts/patch-package.js" \
  "$ROOT_PROJECT_BUILD_DIR/nodejs-assets/nodejs-project/node_modules"

cd -

if [[ "$OSTYPE" == "darwin"* ]]; then
  rm $ROOT_PROJECT_BUILD_DIR/nodejs-assets/build-native-modules-MacOS-helper-script-node.sh
fi

# TODO: This task isn't necessary to for debugging the issue we're looking at.
### 3. GenerateNodeProjectAssetsLists

echo -e "(3) Skipping task GenerateNodeProjectAssetsLists\n"

### 4. CopyNodeProjectAssets

echo -e "(4) Starting task CopyNodeProjectAssets\n"

rm -rf "$ROOT_PROJECT_BUILD_DIR/nodejs-native-assets-temp-build/nodejs-native-assets-${abi_name}/"

mkdir -p "$ROOT_PROJECT_BUILD_DIR/nodejs-native-assets-temp-build/nodejs-native-assets-${abi_name}/nodejs-project/"
cp -fR "$ROOT_PROJECT_PROJECT_DIR/../nodejs-assets/nodejs-project/" \
  "$ROOT_PROJECT_BUILD_DIR/nodejs-native-assets-temp-build/nodejs-native-assets-${abi_name}/nodejs-project/"

### 5. BuildNpmModules

echo -e "(5) Starting task BuildNpmModules\n"

_compileNativeModulesSdkVersion=21

# Get arch
case $abi_name in

'armeabi-v7a')
  temp_arch='arm'
  ;;

'arm64-v8a')
  temp_arch='arm64'
  ;;

*)
  temp_arch=$abi_name
  ;;
esac

# Determine other env variables based on arch
case $temp_arch in

'arm')
  temp_dest_cpu="$temp_arch"
  temp_v8_arch="$temp_arch"
  temp_binutils_prefix="arm-linux-androideabi"
  temp_compiler_prefix="armv7a-linux-androideabi${_compileNativeModulesSdkVersion}"
  cargo_build_target='arm-linux-androideabi'
  ;;

'x86')
  temp_dest_cpu='ia32'
  temp_v8_arch='ia32'
  temp_binutils_prefix="i686-linux-android"
  temp_compiler_prefix="i686-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="i686-linux-android"
  ;;

'x86_64')
  temp_dest_cpu='x64'
  temp_v8_arch='x64'
  temp_binutils_prefix="x86_64-linux-android"
  temp_compiler_prefix="x86_64-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="x86_64-linux-android"
  ;;

'arm64')
  temp_dest_cpu="$temp_arch"
  temp_v8_arch="$temp_arch"
  temp_binutils_prefix="aarch64-linux-android"
  temp_compiler_prefix="aarch64-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="aarch64-linux-android"
  ;;

*)
  echo -e "Unsupported architecture for nodejs-mobile native modules: $temp_arch\n"
  exit 1
  ;;
esac

if [[ "$OSTYPE" == "darwin"* ]]; then
  temp_host_tag='darwin-x86_64'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  temp_host_tag='linux-x86_64'
fi
ndk_bundle_path=$ANDROID_NDK_HOME
toolchain_path="${ndk_bundle_path}/toolchains/llvm/prebuilt/${temp_host_tag}"
npm_toolchain_ar="${toolchain_path}/bin/${temp_binutils_prefix}-ar"
npm_toolchain_cc="${toolchain_path}/bin/${temp_compiler_prefix}-clang"
npm_toolchain_cxx="${toolchain_path}/bin/${temp_compiler_prefix}-clang++"
npm_toolchain_link="${toolchain_path}/bin/${temp_compiler_prefix}-clang++"
cargo_target_triple=$(echo $cargo_build_target | tr '[:lower:]' '[:upper:]' | tr '-' '_')

npm_gyp_defines="target_arch=$temp_arch"
npm_gyp_defines+=" v8_target_arch=$temp_v8_arch"
npm_gyp_defines+=" android_target_arch=$temp_arch"
if [[ "$OSTYPE" == "darwin"* ]]; then
  npm_gyp_defines+=" host_os=mac OS=android"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  npm_gyp_defines+=" host_os=linux OS=android"
fi

npm_config_node_engine="v8"
npm_config_nodedir="$PROJECT_PROJECT_DIR/libnode"
npm_config_arch="$temp_arch"
npm_config_platform="android"
npm_config_format="make-android"

if [[ -f "$PROJECT_PROJECT_DIR/../../nodejs-mobile-gyp/bin/node-gyp.js" ]]; then
  npm_config_node_gyp="$PROJECT_PROJECT_DIR/../../nodejs-mobile-gyp/bin/node-gyp.js"
else
  npm_config_node_gyp="$PROJECT_PROJECT_DIR/../node_modules/nodejs-mobile-gyp/bin/node-gyp.js"
fi

ORIGINAL_PROJECT_BIN="$ROOT_PROJECT_PROJECT_DIR/../nodejs-assets/nodejs-project/node_modules/.bin"

if [[ -d "$ORIGINAL_PROJECT_BIN" ]]; then
  PATH="$ORIGINAL_PROJECT_BIN:$PATH"
fi

CARGO_BUILD_TARGET="$cargo_build_target"

CARGO_TARGET_AR_ENV_VAR="CARGO_TARGET_${cargo_target_triple}_AR"
declare $CARGO_TARGET_AR_ENV_VAR="$npm_toolchain_ar"

CARGO_TARGET_LINKER_ENV_VAR="CARGO_TARGET_${cargo_target_triple}_LINKER"
declare $CARGO_TARGET_LINKER_ENV_VAR="$npm_toolchain_link"

TOOLCHAIN="$toolchain_path"
AR="$npm_toolchain_ar"
CC="$npm_toolchain_cc"
CXX="$npm_toolchain_cxx"
LINK="$npm_toolchain_link"
GYP_DEFINES="$npm_gyp_defines"

TEMP_NATIVE_ASSETS_OUTPUT_DIR="$ROOT_PROJECT_BUILD_DIR/nodejs-native-assets-temp-build/nodejs-native-assets-${abi_name}/nodejs-project"

cd $TEMP_NATIVE_ASSETS_OUTPUT_DIR
$npmCommandName --verbose rebuild --build-from-source $MODULE
cd -

### 6. CopyBuiltNpmAssets

echo -e "(6) Starting task CopyBuiltNpmAssets\n"

BUILD_ASSETS_OUTPUT_DIR="$ROOT_PROJECT_BUILD_DIR/nodejs-native-assets/nodejs-native-assets-${abi_name}"

MODULE_BUILD_RELEASE_PATH="$MODULE/build/Release"

mkdir -p $BUILD_ASSETS_OUTPUT_DIR/node_modules/$MODULE_BUILD_RELEASE_PATH

cp -fR "$TEMP_NATIVE_ASSETS_OUTPUT_DIR/node_modules/$MODULE_BUILD_RELEASE_PATH/" \
  "$BUILD_ASSETS_OUTPUT_DIR/node_modules/$MODULE_BUILD_RELEASE_PATH/"

# Delete all files except for .node (still preserves directories)
find "$BUILD_ASSETS_OUTPUT_DIR/node_modules/$MODULE_BUILD_RELEASE_PATH" -type f -not -name "*.node" -delete
# Delete all directories that are empty (recursive)
find "$BUILD_ASSETS_OUTPUT_DIR/node_modules/$MODULE_BUILD_RELEASE_PATH" -type d -empty -delete

###

echo "All done! Check $BUILD_ASSETS_OUTPUT_DIR/node_modules/$MODULE"
