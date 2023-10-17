# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## nodejs-mobile-react-native

### [Fix prebuilds Gradle step](./nodejs-mobile-react-native+16.17.10+001+fix-prebuilds-gradle-step.patch)

When detecting and handling modules with valid prebuilds, there's a step that involves manipulating the associated package.json file to prevent node-gyp from trying to building it. This step fails since we don't include the package.json, so we can just skip it.

### [Fix CopyNodeProjectAssets Gradle Step](./nodejs-mobile-react-native+16.17.10+002+fix-copy-node-project-assets-gradle-step.patch)

When copying `comapeo-mobile/nodejs-assets/nodejs-project` into `comapeo-mobile/android/build/nodejs-assets/nodejs-project/`, it copies over the `prebuilds` we include for each native module (found in `nodejs-project/node_modules/`). These are never deleted in any of the following Gradle tasks so the APK includes these, which is not necessary because NMRN will use a target-specific directory that contains the native modules for their resolution e.g. `nodejs-native-assets/nodejs-native-assets/armeabi-v7a/node_modules/...`.

### [Disable BuildNpmModules Gradle step](./nodejs-mobile-react-native+16.17.10+003+disable-build-npm-modules-gradle-step.patch)

This step assumes that there exists a `package.json` file and other files related to node-gyp in the native modules that we include, which isn't the case because we solely rely on using prebuilds. There's no need for `npm run build ...` to be called for our native modules, so this step can be skipped entirely.
