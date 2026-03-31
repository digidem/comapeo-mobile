# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `random-access-file`

### [Ignore EINVAL errors](./random-access-file+4.0.7.patch)

This is a workaround for [file lock errors on certain Android devices](https://github.com/digidem/comapeo-core/issues/995). The workaround means that the failure to gain a lock is silently ignored, which may lead to data corruption if more than one process tries to access the file, which should not happen in normal operation.

## `crc-universal`

### [Avoid using `crc-native` module](./crc-universal+1.0.4+001+crc-universal-use-js-only.patch)

Using the native module seems to cause certain devices to crash. See https://github.com/digidem/comapeo-mobile/issues/1096 for more details.

## `typebox`

### [Don't use unicode property escapes](./typebox+1.0.81.patch)

Typebox uses [unicode property escapes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Unicode_character_class_escape#unicode_property_escapes_vs._character_classes) in code which is used to build schemas. We don't use this code, but it is loaded when we use typebox. The unicode property escapes depend on full ICU support in node, and currently the nodejs-mobile build that we use has a minimal ICU build, so the unicode property escapes cause a crash. The patch replaces the property escapes with ascii characters, which should cover most use-cases, and I don't think we even use these code paths anyway.
