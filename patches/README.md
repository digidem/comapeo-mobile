# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished
fixes.

## nodejs-mobile-react-native

### [Fix CopyNodeProjectAssets Gradle Step](./@comapeo+nodejs-mobile-react-native+18.20.4-2+001+fix-copy-node-project-assets-gradle-step.patch)

When copying `comapeo-mobile/nodejs-assets/nodejs-project`
into `comapeo-mobile/android/build/nodejs-assets/nodejs-project/`, it copies over the `prebuilds` we include for each
native module (found in `nodejs-project/node_modules/`). These are never deleted in any of the following Gradle tasks so
the APK includes these, which is not necessary because NMRN will use a target-specific directory that contains the
native modules for their resolution e.g. `nodejs-native-assets/nodejs-native-assets/armeabi-v7a/node_modules/...`.

### [Disable BuildNpmModules Gradle step](./@comapeo+nodejs-mobile-react-native+18.20.4-2+002+disable-build-npm-modules-gradle-step.patch)

This step assumes that there exists a `package.json` file and other files related to node-gyp in the native modules that
we include, which isn't the case because we solely rely on using prebuilds. There's no need for `npm run build ...` to
be called for our native modules, so this step can be skipped entirely.

### [Fix DeleteIncorrectPrebuilds Gradle step](./@comapeo+nodejs-mobile-react-native+18.20.4-2+003+fix-delete-incorrect-prebuilds-gradle-step.patch)

This step deletes all `.node` files found in the temp build directory and always runs after the `CopyNodeProjectAssets`
step. However, the `DetectCorrectPrebuilds` step runs based on the output of `CopyNodeProjectAssets`, which is a
timestamp file that indicates that meaningful work was done in the step. If that file doesn't
change, `DetectCorrectPrebuilds` won't do anything. This becomes problematic in the following sequence:

Part 1: Assuming no prior runs have ever occurred:

1. `CopyNodeProjectAssets` runs. Notices changes to `node_modules` directory (e.g. native prebuilds that we include) and
   eventually updates the timestamp file.
2. `DeleteIncorrectPrebuilds` runs and attempts to delete any existing `.node` files that are not the native prebuilds.
   Nothing of note is affected.
3. `DetectCorrectPrebuilds` runs and since step 1 updated the timestamp file, it does actual work. We end up
   with `node_modules/*/build/Release/*.node` for each native module we have prebuilds for.
4. `CopyBuiltNpmAssets` runs, moving these `node_modules` to the directories in `nodejs-native-assets`.

Part 2: Subsequent run without changing anything

1. `CopyNodeProjectAssets` runs, but detects no changed files so no change to timestamp file.
2. `DeleteIncorrectPrebuilds` runs, deleting the `.node` in the `build/Release/` directory.
3. `DetectCorrectPrebuilds` runs, but since `CopyNodeProjectAssets` didn't update the timestamp file, **it doesn't do
   any work**. **Because of 2, we end up with `node_modules/*/build/Release/` directories that no longer contain
   relevant `.node` files.**
4. `CopyBuiltNpmAssets` runs, moving these `node_modules` to the directories in `nodejs-native-assets`.

Ideally we'd use the timestamp file as an input for the `DeleteIncorrectPrebuilds` step too, but that isn't allowed by
Gradle:

> Note that a task can define either inputs/outputs or destroyables, but not both.

https://docs.gradle.org/current/userguide/incremental_build.html

### [Disable exact development environment Node version check](./@comapeo+nodejs-mobile-react-native+18.20.4-2+004+disable-node-version-check.patch)

This step ensures that the development environment is using the same major Node version as the runtime that comes with
NodeJS Mobile React Native. The check is most relevant when building native modules, but since we use native prebuilds,
skipping it does not seem to affect our ability to build the app and is thus (probably) not needed.

### [Fix copying of Intel-based native prebuilds into native assets directory when building apk](./@comapeo+nodejs-mobile-react-native+18.20.4-2+005+fix-copying-x86-prebuilds.patch)

When targeting Intel-based architectures (i.e. `x86_64`), the affected Gradle build steps were attempting to find native prebuilds using the extended target architecture name i.e. in each directory for relevant native Node modules, it was looking for `prebuilds/android-x86_64/` instead of `prebuilds/android-x64/`. This naming discrepancy is due to how our [prebuild template](https://github.com/digidem/nodejs-mobile-prebuilds-template) publishes the output from https://github.com/nodejs-mobile/prebuild-for-nodejs-mobile/, which uses an abbreviated name of the architecture (e.g. `x86_64` is referred to as `x64`).

### [Fix addon resolution for addons using require-addon](./@comapeo+nodejs-mobile-react-native+18.20.4-2+006+fix-bare-prebuilds.patch)

Native addons by the holepunch team use [`require-addon`](https://github.com/holepunchto/require-addon) to load native prebuilds. This package expects the native prebuilds to be in a `prebuilds/` directory at the root of the package, in contrast to modules which use `node-gyp-build`, which, at runtime, looks for prebuilds in `build/Release/`. This patch moves the prebuilds into the correct folder based on the presence of `binding.gyp`, and cleans up any unnecessary prebuilds to keep the APK size down.

## `react-native-confirmation-code-field`

### [Fix mask symbol logic issue](./react-native-confirmation-code-field+9.0.0+001+fix-mask-symbol-logic-issue.patch)

Fixes a bug in the `MaskSymbol` component where the mask (`*`) briefly un-hides when typing quickly. This patch sets the `visibleFlag` to `false` immediately, preventing the undesired flicker.

See: [Reviewer context](https://github.com/digidem/comapeo-mobile/pull/1225).

## react-native-vision-camera

### [Fix camera device list startup race](./react-native-vision-camera+4.7.3+001+fix-camera-devices-startup-race.patch)

`CameraDevicesManager` sends its device list to JS only at startup, but builds that list from `cameraProvider` and
`extensionsManager`, which initialise asynchronously and yield an empty list until both are set. When initialisation
loses that race, JS caches the empty list and nothing ever re-emits, so `useCameraDevice()` returns `undefined` — and the
camera screen stays unavailable — until the app is restarted. This patch emits `CameraDevicesChanged` once
initialisation completes, and re-sends the current list when JS subscribes, since events emitted before then are
dropped.

Fixed upstream in v5, which requires the New Architecture. 4.7.3 is the final 4.x release, so there is nothing to
upgrade to.

## expo

### [Enable streaming file uploads in fetch API](./expo+54.0.33.patch)

Modifies Expo's native fetch implementation to stream files directly to the fetch request rather than loading them into memory. This patch enables streaming uploads by modifying the native Android code to read and transmit files in chunks. This prevents out-of-memory (OOM) errors when uploading large files (e.g., over 200MB).
Refer to this [issue](https://github.com/expo/expo/issues) and this [PR](https://github.com/expo/expo/pull) which have been created to address this limitation in Expo's fetch implementation.
