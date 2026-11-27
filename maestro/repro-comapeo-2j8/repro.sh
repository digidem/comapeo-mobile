#!/usr/bin/env bash
# Regression test for COMAPEO-2J8 ("CannotAddLayerException: Cannot add layer
# twice" when the user-location puck appears after the map style reloaded).
#
# How to run it:
#   1. Boot an emulator from a Google APIs system image (it needs Google Play
#      services, which expo-location uses) and `cmd location` (API 30+).
#      Tested on Pixel 7a, API 34, google_apis/arm64-v8a.
#   2. Put any .smp background map at /sdcard/Download/ on the emulator, e.g.
#        adb push demotiles.smp /sdcard/Download/
#   3. Build and install a release build (SENTRY_DISABLE_AUTO_UPLOAD=true keeps
#      local builds from uploading sourcemaps):
#        APP_VARIANT=releaseCandidate npx expo prebuild --platform android
#        cd android && SENTRY_DISABLE_AUTO_UPLOAD=true \
#          APP_VARIANT=releaseCandidate ./gradlew assembleRelease
#        adb install -r app/build/outputs/apk/release/app-release.apk
#   4. ANDROID_SERIAL=<serial> maestro/repro-comapeo-2j8/repro.sh
#
# Expected: without the MapLibre patch the app crashes and the script prints
# "FAIL" with the stack trace (exit 1). With the patch it prints "PASS"
# (exit 0). SKIP_IMPORT=1 skips the map import; that run passes either way.
#
# The script clears the app's data and changes the emulator's location setting.
set -euo pipefail

: "${ANDROID_SERIAL:?set ANDROID_SERIAL to the emulator serial}"
DIR="$(cd "$(dirname "$0")" && pwd)"
ADB="${ADB:-$HOME/Library/Android/sdk/platform-tools/adb}"
APP=com.comapeo.rc

crashed() { "$ADB" logcat -d | grep -q "Cannot add layer twice"; }

# 1. No location, so the puck layers are never added and the current-track
#    layers (beforeId = puck layer) each register a layer waiter.
"$ADB" shell cmd location set-location-enabled false
"$ADB" logcat -c
maestro --device "$ANDROID_SERIAL" test "$DIR/onboard-to-map.yaml"

# 2. Importing a map changes the style URL. The style reload re-adds every
#    source, so each current-track layer registers a second waiter.
if [ "${SKIP_IMPORT:-0}" != 1 ]; then
  maestro --device "$ANDROID_SERIAL" test "$DIR/import-map.yaml"
fi

# 3. A location fix mounts the puck and both waiters fire. Unpatched, the
#    second one re-adds the same layer and the app crashes.
"$ADB" shell cmd location set-location-enabled true
for i in 1 2 3 4 5 6 7 8 9 10; do
  "$ADB" emu geo fix "-69.94$i" "-4.23$i" >/dev/null
  sleep 2
  if crashed; then break; fi
done

if crashed; then
  echo "FAIL: app crashed with CannotAddLayerException"
  "$ADB" logcat -d | grep -A40 "FATAL EXCEPTION" | grep -E "FATAL|Exception|at " | head -40
  exit 1
fi
if ! "$ADB" shell pidof $APP >/dev/null; then
  echo "FAIL: app is not running"
  exit 1
fi
# The GPS pill shows "±N m" once the app has a fix, i.e. <UserLocation> is rendered.
if ! "$ADB" exec-out uiautomator dump /dev/tty | grep -q 'text="±'; then
  echo "FAIL: app never got a location fix, so the test proved nothing"
  exit 1
fi
echo "PASS: location fix shown, no crash"
