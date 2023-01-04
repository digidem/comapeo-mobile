#!/bin/bash

### Debug script to replicate steps taken by NodeJS Mobile React Native (see its android/build.gradle)
### Intended to only work on a single module at a time
### Takes two arguments:
### 1. Module name e.g. better-sqlite3
### 2. ABI name e.g. arm64-v8a

set -eEu -o pipefail
shopt -s extdebug extglob
IFS=$'\n\t'

OR='\033[0;33m' # Orange
NC='\033[0m'    # No Color

trap 'onFailure $?' ERR

function onFailure() {
  echo "Unhandled script error $1 at ${BASH_SOURCE[0]}:${BASH_LINENO[0]}" >&2
  exit 1
}

##################################################################

### 0. Parse args

MODULE=$1
ARCH=$2
NDK_VERSION=21.4.7075529

if [[ -z "${ANDROID_SDK_ROOT}" ]]; then
  echo -e "Environment variable \$ANDROID_SDK_ROOT must be set to the folder where the Android SDK is installed"
fi

ANDROID_NDK_ROOT="${ANDROID_SDK_ROOT}/ndk/${NDK_VERSION}"
project_dir=$(
  cd "$(dirname "$(dirname "${BASH_SOURCE[0]}")")"
  pwd -P
)
project_npm_bin="${project_dir}/node_modules/.bin"
nodejs_mobile_dir=$(
  cd "${project_dir}"
  node -e 'process.stdout.write(require("path").dirname(require.resolve("nodejs-mobile-react-native/package.json")));'
)
nodejs_mobile_gyp_dir=$(
  cd "${project_dir}"
  node -e 'process.stdout.write(require("path").dirname(require.resolve("nodejs-mobile-gyp/package.json")));'
)
node_gyp="${nodejs_mobile_gyp_dir}/bin/node-gyp.js"

# export PATH="${project_npm_bin}:$PATH"

echo -e "Building native modules for \"$MODULE\" ($ARCH)\n"

### 1. Set up environment

echo -e "${OR}(1) Setting up env variables\n${NC}"

_compileNativeModulesSdkVersion=21

# Determine other env variables based on arch
case $ARCH in

'arm')
  temp_v8_arch="$ARCH"
  temp_binutils_prefix="arm-linux-androideabi"
  temp_compiler_prefix="armv7a-linux-androideabi${_compileNativeModulesSdkVersion}"
  cargo_build_target='arm-linux-androideabi'
  ;;

'x86')
  temp_v8_arch='ia32'
  temp_binutils_prefix="i686-linux-android"
  temp_compiler_prefix="i686-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="i686-linux-android"
  ;;

'x86_64')
  temp_v8_arch='x64'
  temp_binutils_prefix="x86_64-linux-android"
  temp_compiler_prefix="x86_64-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="x86_64-linux-android"
  ;;

'arm64')
  temp_v8_arch="$ARCH"
  temp_binutils_prefix="aarch64-linux-android"
  temp_compiler_prefix="aarch64-linux-android${_compileNativeModulesSdkVersion}"
  cargo_build_target="aarch64-linux-android"
  ;;

*)
  echo -e "Unsupported architecture for nodejs-mobile native modules: $ARCH\n"
  echo -e "Choose one of: arm, arm64, x86, x86_64\n"
  exit 1
  ;;
esac

if [[ "$OSTYPE" == "darwin"* ]]; then
  temp_host_tag='darwin-x86_64'
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  temp_host_tag='linux-x86_64'
fi
toolchain_path="${ANDROID_NDK_ROOT}/toolchains/llvm/prebuilt/${temp_host_tag}"
npm_toolchain_ar="${toolchain_path}/bin/${temp_binutils_prefix}-ar"
npm_toolchain_cc="${toolchain_path}/bin/${temp_compiler_prefix}-clang"
npm_toolchain_cxx="${toolchain_path}/bin/${temp_compiler_prefix}-clang++"
npm_toolchain_link="${toolchain_path}/bin/${temp_compiler_prefix}-clang++"
cargo_target_triple=$(echo $cargo_build_target | tr '[:lower:]' '[:upper:]' | tr '-' '_')

npm_gyp_defines="target_arch=$ARCH"
npm_gyp_defines+=" v8_target_arch=$temp_v8_arch"
npm_gyp_defines+=" android_target_arch=$ARCH"
if [[ "$OSTYPE" == "darwin"* ]]; then
  npm_gyp_defines+=" host_os=mac OS=android"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  npm_gyp_defines+=" host_os=linux OS=android"
fi

export npm_config_node_engine="v8"
export npm_config_nodedir="$nodejs_mobile_dir/android/libnode"
export npm_config_arch="$ARCH"
export npm_config_platform="android"
export npm_config_format="make-android"
export npm_config_node_gyp="${node_gyp}"
export npm_config_loglevel="silly"

export CARGO_BUILD_TARGET="$cargo_build_target"

CARGO_TARGET_AR_ENV_VAR="CARGO_TARGET_${cargo_target_triple}_AR"
declare -x "$CARGO_TARGET_AR_ENV_VAR"="$npm_toolchain_ar"

CARGO_TARGET_LINKER_ENV_VAR="CARGO_TARGET_${cargo_target_triple}_LINKER"
declare -x "$CARGO_TARGET_LINKER_ENV_VAR"="$npm_toolchain_link"

export TOOLCHAIN="$toolchain_path"
export AR="$npm_toolchain_ar"
export CC="$npm_toolchain_cc"
export CXX="$npm_toolchain_cxx"
export LINK="$npm_toolchain_link"
export GYP_DEFINES="$npm_gyp_defines"

printenv | grep "npm_config_.*"
printenv | grep "CARGO_.*"
printenv | grep "TOOLCHAIN=.*"
printenv | grep "AR=.*"
printenv | grep "CC=.*"
printenv | grep "CXX=.*"
printenv | grep "LINK=.*"
printenv | grep "GYP_DEFINES=.*"
printenv | grep "^PATH=.*"

### 2. Build npm module

echo -e "\n${OR}(2) Build npm module\n${NC}"

npm --verbose rebuild --build-from-source "${MODULE}"

###

echo "All done!"
