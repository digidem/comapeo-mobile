# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `@rollup/plugin-esm`

### [Fix shim insertion](./@rollup+plugin-esm-shim+0.1.4+001+fix-shim-insertion.patch)

This is a workaround for [a bug in the plugin](https://github.com/rollup/plugins/issues/1709).

## `random-access-file`

### [Ignore EINVAL errors](./random-access-file+4.0.7.patch)

This is a workaround for [file lock errors on certain Android devices](https://github.com/digidem/comapeo-core/issues/995). The workaround means that the failure to gain a lock is silently ignored, which may lead to data corruption if more than one process tries to access the file, which should not happen in normal operation.
