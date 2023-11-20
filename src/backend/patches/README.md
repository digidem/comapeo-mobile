# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `@mapeo/core`

### [Fix quickbit dynamic require](./@mapeo+core+9.0.0-alpha.2+001+fix-quickbit-dynamic-require.patch)

Rollup complains about the dynamic require of `quickbit-universal` in this file. Easier to just simplify the import

### [Fix Drizzle migrations paths](./@mapeo+core+9.0.0-alpha.2+002+fix-drizzle-migration-paths.patch)

The migration paths don't account for bundling. Need to hardcode the path that we want when this is running on the device.
