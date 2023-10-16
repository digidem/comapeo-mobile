# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## nodejs-mobile-react-native

### [Fix prebuilds gradle step](./nodejs-mobile-react-native+16.17.10+001+nmrn-fix-prebuilds-gradle-step.patch)

When detecting and handling modules with valid prebuilds, there's a step that involves manipulating the associated package.json file to prevent node-gyp from trying to building it. This step fails since we don't include the package.json, so we can just skip it.
