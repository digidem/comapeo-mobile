# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `random-access-file`

### [Ignore EINVAL errors](./random-access-file+4.0.7.patch)

This is a workaround for [file lock errors on certain Android devices](https://github.com/digidem/comapeo-core/issues/995). The workaround means that the failure to gain a lock is silently ignored, which may lead to data corruption if more than one process tries to access the file, which should not happen in normal operation.

## `crc-universal`

### [Avoid using `crc-native` module](./crc-universal+1.0.4+001+crc-universal-use-js-only.patch)

Using the native module seems to cause certain devices to crash. See https://github.com/digidem/comapeo-mobile/issues/1096 for more details.
