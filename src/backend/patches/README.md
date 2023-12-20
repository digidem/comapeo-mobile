# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `@mapeo/core`

### [Fix quickbit dynamic require](./@mapeo+core+9.0.0-alpha.2+001+fix-quickbit-dynamic-require.patch)

Rollup complains about the dynamic require of `quickbit-universal` in this file. Easier to just simplify the import
