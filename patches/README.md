# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished
fixes.

## nodejs-mobile-react-native

### [Fix prebuilds Gradle step](./nodejs-mobile-react-native+18.17.7+001+fix-prebuilds-gradle-step.patch)

When detecting and handling modules with valid prebuilds, there's a step that involves manipulating the associated
package.json file to prevent node-gyp from trying to building it. This step fails since we don't include the
package.json, so we can just skip it.

### [Fix CopyNodeProjectAssets Gradle Step](./nodejs-mobile-react-native+18.17.7+002+fix-copy-node-project-assets-gradle-step.patch)

When copying `comapeo-mobile/nodejs-assets/nodejs-project`
into `comapeo-mobile/android/build/nodejs-assets/nodejs-project/`, it copies over the `prebuilds` we include for each
native module (found in `nodejs-project/node_modules/`). These are never deleted in any of the following Gradle tasks so
the APK includes these, which is not necessary because NMRN will use a target-specific directory that contains the
native modules for their resolution e.g. `nodejs-native-assets/nodejs-native-assets/armeabi-v7a/node_modules/...`.

### [Disable BuildNpmModules Gradle step](./nodejs-mobile-react-native+18.17.7+003+disable-build-npm-modules-gradle-step.patch)

This step assumes that there exists a `package.json` file and other files related to node-gyp in the native modules that
we include, which isn't the case because we solely rely on using prebuilds. There's no need for `npm run build ...` to
be called for our native modules, so this step can be skipped entirely.

### [Fix DeleteIncorrectPrebuilds Gradle step](./nodejs-mobile-react-native+18.17.7+004+fix-delete-incorrect-prebuilds-gradle-step.patch)

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

### [Disable exact development environment Node version check](./nodejs-mobile-react-native+18.17.7+005+disable-node-version-check.patch)

This step ensures that the development environment is using the same major Node version as the runtime that comes with
NodeJS Mobile React Native. The check is most relevant when building native modules, but since we use native prebuilds,
skipping it does not seem to affect our ability to build the app and is thus (probably) not needed.

### [Fix copying of Intel-based native prebuilds into native assets directory when building apk](./nodejs-mobile-react-native+18.17.7+006+fix-copying-x86-prebuilds.patch)

When targeting Intel-based architectures (i.e. `x86_64`), the affected Gradle build steps were attempting to find native prebuilds using the extended target architecture name i.e. in each directory for relevant native Node modules, it was looking for `prebuilds/android-x86_64/` instead of `prebuilds/android-x64/`. This naming discrepancy is due to how our [prebuild template](https://github.com/digidem/nodejs-mobile-prebuilds-template) publishes the output from https://github.com/nodejs-mobile/prebuild-for-nodejs-mobile/, which uses an abbreviated name of the architecture (e.g. `x86_64` is referred to as `x64`).

## @react-native/eslint-config

### [Disable prettier plugin rules](./@react-native+eslint-config+0.73.2.patch)

The module uses a plugin whose currently specified version is not compatible with Prettier v3. Additionally, it is not
desirable to have Prettier tightly integrated with ESLint. The patch removes the usage of the discouraged plugin.

We can remove this if either [this](https://github.com/facebook/react-native/pull/41877)
or [this](https://github.com/facebook/react-native/pull/43756) is merged.

## @mapeo/ipc

### [Change imports to avoid calling unavailable code](./@mapeo+ipc+0.7.0.patch)

There was an error while running app via Expo because of exports in `rpc-reflector` package. To remove this patch, `rpc-reflector` would need to be updated not to use `encode-decode.js` file which indirect usage results in errors.

## rpc-reflector

### [Change imports to avoid calling unavailable code](./rpc-reflector+1.3.11.patch)

There was an error while running app via Expo because of `duplex` method call in `rpc-reflector` package.
As this feature is not used in CoMapeo, this can be safely hardcoded to `false`. To remove this patch, `rpc-reflector` would need to be updated to account for this bug.

## @rnmapbox/maps

### [Remove AbortController test mock](./@rnmapbox+maps+10.1.19.patch)

This library includes an `AbortController` test mock, which doesn't work in places that expect a real one.
Because `AbortController` is supported in our environments, we don't need this mock.

[This patch has been merged upstream](https://github.com/rnmapbox/maps/pull/3506) but not yet deployed.
