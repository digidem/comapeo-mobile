#!/bin/bash

# Uploads the @comapeo/core-react-native Node backend bundle's sourcemaps to
# Sentry so backend (Node) stack traces symbolicate. The host app's own JS
# sourcemaps and native dSYMs/symbols are handled separately by the
# @sentry/react-native/expo plugin (see app.json); this covers the third,
# embedded-Node runtime that plugin does not see.
#
# The backend bundle + maps ship inside the installed package, so this only
# needs SENTRY_AUTH_TOKEN and runs on the EAS on-success hook. Symbolication is
# debug-ID based, so re-uploads are idempotent and the app release tag need not
# match.

set -e

case "$EAS_BUILD_PROFILE" in
  production | release-candidate | pre-release) ;;
  *) exit 0 ;;
esac

if [ -z "$SENTRY_AUTH_TOKEN" ]; then
  echo "Warning: SENTRY_AUTH_TOKEN not set, skipping backend sourcemap upload"
  exit 0
fi

# EAS builds one platform per job; upload only that platform's targets. A
# release build uses the android-main variant (debug is local-only).
if [ "$EAS_BUILD_PLATFORM" = "ios" ]; then
  TARGETS="ios"
else
  TARGETS="android-main"
fi

echo "Uploading backend sourcemaps (targets: $TARGETS)"
npx comapeo-rn-upload-sourcemaps \
  --org awana-digital \
  --project comapeo \
  --targets "$TARGETS"
echo "Backend sourcemap upload complete"
