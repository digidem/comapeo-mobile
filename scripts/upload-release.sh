#!/bin/bash

set -e

if [ "$EAS_BUILD_PROFILE" = "production" ]; then
  BUILD_PROFILE='release'
elif [ "$EAS_BUILD_PROFILE" = "release-candidate" ]; then
  BUILD_PROFILE='rc'
elif [ "$EAS_BUILD_PROFILE" = "pre-release" ]; then
  BUILD_PROFILE='pre'
else
  exit 0
fi

if [ "$EAS_BUILD_PROFILE" = "production" ]; then
  echo "Production build detected - extracting and signing APK from AAB"

  BUNDLE_TOOL_VERSION=1.18.2
  curl -L -O https://github.com/google/bundletool/releases/download/$BUNDLE_TOOL_VERSION/bundletool-all-$BUNDLE_TOOL_VERSION.jar

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
  APK_FILE="universal.apk"
else
  echo "RC or test build detected - using pre-built signed APK"
  APK_FILE="android/app/build/outputs/apk/release/app-release.apk"

  APP_VERSION_NAME=$(aapt dump badging "$APK_FILE" | grep versionName | sed -n "s/.*versionName='\([^']*\)'.*/\1/p")
fi

BASE_PATH="/android/${BUILD_PROFILE}"
APK_UPLOAD_PATH="${BASE_PATH}/comapeo-v${APP_VERSION_NAME}.apk"
METADATA_UPLOAD_PATH="${BASE_PATH}/latest.json"

echo "{ \"version_name\": \"${APP_VERSION_NAME}\", \"file_path\": \"${APK_UPLOAD_PATH}\" }" > latest.json

wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
./mc alias set cf "${AWS_ENDPOINT_URL}" "${AWS_ACCESS_KEY_ID}" "${AWS_SECRET_ACCESS_KEY}"

echo "Uploading to ${APK_UPLOAD_PATH}"
./mc cp "$APK_FILE" "cf/${S3_BUCKET_NAME}/${APK_UPLOAD_PATH}"
echo "Uploading to ${METADATA_UPLOAD_PATH}"
./mc cp latest.json "cf/${S3_BUCKET_NAME}/${METADATA_UPLOAD_PATH}"
echo "Upload complete"
