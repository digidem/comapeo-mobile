#!/bin/bash

BUNDLE_TOOL_VERSION=1.18.2

#curl -L -O https://github.com/google/bundletool/releases/download/$BUNDLE_TOOL_VERSION/bundletool-all-$BUNDLE_TOOL_VERSION.jar

#java -jar bundletool-all-$BUNDLE_TOOL_VERSION.jar build-apks \
  --bundle=android/app/build/outputs/bundle/release/app-release.aab \
  --output=comapeo.apks \
  --mode=universal

#unzip comapeo.apks universal.apk

APP_VERSION_NAME=$(aapt dump badging universal.apk | grep versionName | sed -n "s/.*versionName='\([^']*\)'.*/\1/p")
S3_FILE_PATH="android/${APP_VARIANT}/v${APP_VERSION_NAME}/comapeo-v${APP_VERSION_NAME}.apk"

echo "{ \"version_name\": \"${APP_VERSION_NAME}\", \"file_path\": \"${S3_FILE_PATH}\" }" > latest.json


echo "uploading to ${S3_BUCKET_NAME} ${S3_FILE_PATH}"

aws s3 cp --endpoint-url ${S3_ENDPOINT_URL} --bucket "${S3_BUCKET_NAME}" universal.apk  "${S3_FILE_PATH}"
aws s3 cp --endpoint-url ${S3_ENDPOINT_URL} --bucket "${S3_BUCKET_NAME}" latest.json "${S3_FILE_PATH}/latest.json"
