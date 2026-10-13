# Building and installing on a physical iOS device

This describes how to build a **standalone, offline-capable** build of the app
and install it directly onto a physical iPhone — useful for field testing
without a laptop/Metro connection.

The build uses the **Release** configuration, which embeds the Hermes JS bundle
into the app, so it runs without the Metro bundler. For store / TestFlight
releases, use EAS instead (see [Releases.md](./Releases.md)).

## Prerequisites

- macOS with Xcode installed.
- An Apple Developer account added to Xcode (Xcode → Settings → Accounts) and an
  "Apple Development" signing identity in your keychain.
- The iPhone connected via USB, **paired and trusted**, with **Developer Mode**
  enabled (Settings → Privacy & Security → Developer Mode → on, then reboot).
- Project dependencies installed (`npm install`).

## 1. Generate the native iOS project (prebuild)

`APP_VARIANT` selects the variant (app name / bundle id). `releaseCandidate`
produces "CoMapeo RC" (`com.comapeo.rc`); other values are `development`
(`.dev`), `preRelease` (`.pre`), and `production`.

```sh
APP_VARIANT=releaseCandidate npx expo prebuild --platform ios
```

Add `--clean` if you've changed [`app.json`](../app.json) /
[`app.config.js`](../app.config.js) or hand-edited the `ios/` directory. The
config plugin bakes the default categories (`defaultConfig`) into the app during
this step.

## 2. Find your device id and signing team

```sh
# Device identifier (and pairing/Developer Mode state)
xcrun devicectl list devices

# Signing team id — the (XXXXXXXXXX) in the identity name, i.e. the cert's OU
security find-identity -v -p codesigning
```

## 3. Build the Release (field) build

```sh
cd ios
xcodebuild -workspace CoMapeoRC.xcworkspace -scheme CoMapeoRC \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -derivedDataPath ./build \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM=<YOUR_TEAM_ID> \
  CODE_SIGN_STYLE=Automatic \
  build
cd ..
```

- `-destination 'generic/platform=iOS'` builds for a generic device and avoids
  the *"developer disk image could not be mounted"* error you get when targeting
  the connected device directly for a build.
- `-allowProvisioningUpdates` lets Xcode register the device and create a
  development provisioning profile automatically.
- If SwiftPM fails with *"Couldn't get the list of tags"* (resolving the
  MapLibre package), resolve once and rebuild:

  ```sh
  xcodebuild -workspace ios/CoMapeoRC.xcworkspace -scheme CoMapeoRC \
    -derivedDataPath ios/build -resolvePackageDependencies
  ```

  If it still fails with *"cannot use bare repository ... (safe.bareRepository
  is 'explicit')"*, your global git has `safe.bareRepository = explicit`, which
  blocks SwiftPM's bare package caches. Override it for the build process only
  (don't change your global config) by prefixing the `xcodebuild` commands with:

  ```sh
  GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=safe.bareRepository GIT_CONFIG_VALUE_0=all \
    xcodebuild ...
  ```

## 4. Install on the device

```sh
xcrun devicectl device install app \
  --device <DEVICE_ID> \
  ios/build/Build/Products/Release-iphoneos/CoMapeoRC.app
```

## 5. (Optional) Launch remotely

```sh
xcrun devicectl device process launch --device <DEVICE_ID> com.comapeo.rc
```

## Notes

- The build runs untethered — disconnect and take the device into the field.
- The location permission prompt is shown only once per install. To re-test the
  onboarding / permission flow, delete the app from the device first.
- Development-signed builds from a paid team are valid for a year; from a free
  personal team, ~7 days (after which they must be reinstalled).
