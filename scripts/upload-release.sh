#!/bin/bash

set -e  # Exit on error

BUNDLE_TOOL_VERSION=1.18.2

curl -L -O https://github.com/google/bundletool/releases/download/$BUNDLE_TOOL_VERSION/bundletool-all-$BUNDLE_TOOL_VERSION.jar

if [ "$EAS_BUILD_PROFILE" = "production" ]; then
  BUILD_PROFILE='release'
elif [ "$EAS_BUILD_PROFILE" = "release-candidate" ]; then
  BUILD_PROFILE='rc'
elif [ "$EAS_BUILD_PROFILE" = "pre-release" ]; then
  BUILD_PROFILE='test'
else
  exit 0
fi

APP_VERSION_NAME=$(java -jar bundletool-all-$BUNDLE_TOOL_VERSION.jar dump manifest \
  --bundle=android/app/build/outputs/bundle/release/app-release.aab \
  --xpath=/manifest/@android:versionName)

if [ -f "credentials.json" ]; then
  echo "Found credentials.json, using keystore for signing"
  KEYSTORE_PATH=$(node -e "console.log(require('./credentials.json').android.keystore.keystorePath)")
  KEYSTORE_PASS=$(node -e "console.log(require('./credentials.json').android.keystore.keystorePassword)")
  KEY_ALIAS=$(node -e "console.log(require('./credentials.json').android.keystore.keyAlias)")
  KEY_PASS=$(node -e "console.log(require('./credentials.json').android.keystore.keyPassword)")

  java -jar bundletool-all-$BUNDLE_TOOL_VERSION.jar build-apks \
    --bundle=android/app/build/outputs/bundle/release/app-release.aab \
    --output=comapeo.apks \
    --mode=universal \
    --ks="$KEYSTORE_PATH" \
    --ks-key-alias="$KEY_ALIAS" \
    --ks-pass="pass:$KEYSTORE_PASS" \
    --key-pass="pass:$KEY_PASS"
else
  echo "Warning: credentials.json not found, creating unsigned APK"
  java -jar bundletool-all-$BUNDLE_TOOL_VERSION.jar build-apks \
    --bundle=android/app/build/outputs/bundle/release/app-release.aab \
    --output=comapeo.apks \
    --mode=universal
fi

unzip -o comapeo.apks universal.apk

S3_BASE_PATH="s3://${S3_BUCKET_NAME}/android/${BUILD_PROFILE}"
APK_UPLOAD_PATH="${S3_BASE_PATH}/comapeo-v${APP_VERSION_NAME}.apk"
METADATA_UPLOAD_PATH="${S3_BASE_PATH}/latest.json"

echo "{ \"version_name\": \"${APP_VERSION_NAME}\", \"file_path\": \"/android/${BUILD_PROFILE}/comapeo-v${APP_VERSION_NAME}.apk\" }" > latest.json

echo "Uploading to ${APK_UPLOAD_PATH}"
aws s3 cp universal.apk  "${APK_UPLOAD_PATH}"
echo "Uploading to ${METADATA_UPLOAD_PATH}"
aws s3 cp latest.json "${METADATA_UPLOAD_PATH}"
echo "Upload complete"