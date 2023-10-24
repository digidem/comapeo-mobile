# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## nodejs-mobile-react-native

### [Fix prebuilds Gradle step](./nodejs-mobile-react-native+16.17.10+001+fix-prebuilds-gradle-step.patch)

When detecting and handling modules with valid prebuilds, there's a step that involves manipulating the associated package.json file to prevent node-gyp from trying to building it. This step fails since we don't include the package.json, so we can just skip it.

### [Fix CopyNodeProjectAssets Gradle Step](./nodejs-mobile-react-native+16.17.10+002+fix-copy-node-project-assets-gradle-step.patch)

When copying `comapeo-mobile/nodejs-assets/nodejs-project` into `comapeo-mobile/android/build/nodejs-assets/nodejs-project/`, it copies over the `prebuilds` we include for each native module (found in `nodejs-project/node_modules/`). These are never deleted in any of the following Gradle tasks so the APK includes these, which is not necessary because NMRN will use a target-specific directory that contains the native modules for their resolution e.g. `nodejs-native-assets/nodejs-native-assets/armeabi-v7a/node_modules/...`.

### [Disable BuildNpmModules Gradle step](./nodejs-mobile-react-native+16.17.10+003+disable-build-npm-modules-gradle-step.patch)

This step assumes that there exists a `package.json` file and other files related to node-gyp in the native modules that we include, which isn't the case because we solely rely on using prebuilds. There's no need for `npm run build ...` to be called for our native modules, so this step can be skipped entirely.

### [Fix DeleteIncorrectPrebuilds Gradle step](./nodejs-mobile-react-native+16.17.10+004+fix-delete-incorrect-prebuilds-gradle-step.patch)

This step deletes all `.node` files found in the temp build directory and always runs after the `CopyNodeProjectAssets` step. However, the `DetectCorrectPrebuilds` step runs based on the output of `CopyNodeProjectAssets`, which is a timestamp file that indicates that meaningful work was done in the step. If that file doesn't change, `DetectCorrectPrebuilds` won't do anything. This becomes problematic in the following sequence:

Part 1: Assuming no prior runs have ever occurred:

1. `CopyNodeProjectAssets` runs. Notices changes to `node_modules` directory (e.g. native prebuilds that we include) and eventually updates the timestamp file.
2. `DeleteIncorrectPrebuilds` runs and attempts to delete any existing `.node` files that are not the native prebuilds. Nothing of note is affected.
3. `DetectCorrectPrebuilds` runs and since step 1 updated the timestamp file, it does actual work. We end up with `node_modules/*/build/Release/*.node` for each native module we have prebuilds for.
4. `CopyBuiltNpmAssets` runs, moving these `node_modules` to the directories in `nodejs-native-assets`.

Part 2: Subsequent run without changing anything

1. `CopyNodeProjectAssets` runs, but detects no changed files so no change to timestamp file.
2. `DeleteIncorrectPrebuilds` runs, deleting the `.node` in the `build/Release/` directory.
3. `DetectCorrectPrebuilds` runs, but since `CopyNodeProjectAssets` didn't update the timestamp file, **it doesn't do any work**. **Because of 2, we end up with `node_modules/*/build/Release/` directories that no longer contain relevant `.node` files.**
4. `CopyBuiltNpmAssets` runs, moving these `node_modules` to the directories in `nodejs-native-assets`.

Ideally we'd use the timestamp file as an input for the `DeleteIncorrectPrebuilds` step too, but that isn't allowed by Gradle:

> Note that a task can define either inputs/outputs or destroyables, but not both.

https://docs.gradle.org/current/userguide/incremental_build.html
