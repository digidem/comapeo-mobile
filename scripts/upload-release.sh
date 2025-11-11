#!/bin/bash

BUNDLE_TOOL_VERSION=1.18.2

curl -L -O https://github.com/google/bundletool/releases/download/$BUNDLE_TOOL_VERSION/bundletool-all-$BUNDLE_TOOL_VERSION.jar

java -jar bundletool-all-$BUNDLE_TOOL_VERSION.jar build-apks \
  --bundle=android/app/build/outputs/bundle/release/app-release.aab \
  --output=comapeo.apks \
  --mode=universal

unzip -o comapeo.apks universal.apk

if [ "$EAS_BUILD_PROFILE" = "production" ]; then
  BUILD_PROFILE='release'
elif [ "$EAS_BUILD_PROFILE" = "release-candidate" ]; then
  BUILD_PROFILE='rc'
elif [ "$EAS_BUILD_PROFILE" = "pre-release" ]; then
  BUILD_PROFILE='test'
else
  exit 0
fi

APP_VERSION_NAME=$(aapt dump badging universal.apk | grep versionName | sed -n "s/.*versionName='\([^']*\)'.*/\1/p")
S3_BASE_PATH="s3://${S3_BUCKET_NAME}/android/${BUILD_PROFILE}"
APK_UPLOAD_PATH="${S3_BASE_PATH}/comapeo-v${APP_VERSION_NAME}.apk"
METADATA_UPLOAD_PATH="${S3_BASE_PATH}/latest.json"

# Changed: file_path now uses pathname format starting with /
echo "{ \"version_name\": \"${APP_VERSION_NAME}\", \"file_path\": \"/android/${BUILD_PROFILE}/comapeo-v${APP_VERSION_NAME}.apk\" }" > latest.json

echo "Uploading to ${APK_UPLOAD_PATH}"
aws s3 cp universal.apk  "${APK_UPLOAD_PATH}"
echo "Uploading to ${METADATA_UPLOAD_PATH}"
aws s3 cp latest.json "${METADATA_UPLOAD_PATH}"
echo "Upload complete"