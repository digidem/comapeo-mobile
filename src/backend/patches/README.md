# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `@mapeo/core`

### [Fix quickbit dynamic require](@mapeo+core+9.0.0-alpha.6.patch)

- Rollup complains about the dynamic require of `quickbit-universal` in this file. Easier to just simplify the import

## `@electron/asar`

### [Remove conditional `original-fs` import](./@electron+asar+3.2.9+001+remove-original-fs-require.patch)

`original-fs` is conditionally imported (based on Electron-specific checks) but Rollup is not smart enough to lazily require the module in the bundled output. This causes errors at runtime because an import of a non-existent module occurs.
