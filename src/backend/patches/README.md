# Patches

These patches use [patch-package](https://github.com/ds300/patch-package) to update dependencies which have unpublished fixes.

## `@mapeo/core`

### [Fix quickbit dynamic require](./@mapeo+core+9.0.0-alpha.12+001+fix-quickbit-dynamic-require.patch)

- Rollup complains about the dynamic require of `quickbit-universal` in this file. Easier to just simplify the import

## `@electron/asar`

### [Remove conditional `original-fs` import](./@electron+asar+3.2.9+001+remove-original-fs-require.patch)

`original-fs` is conditionally imported (based on Electron-specific checks) but Rollup is not smart enough to lazily require the module in the bundled output. This causes errors at runtime because an import of a non-existent module occurs.

## `@rollup/plugin-esm`

### [Fix shim insertion](./@rollup+plugin-esm-shim+0.1.4+001+fix-shim-insertion.patch)

This is a workaround for [a bug in the plugin](https://github.com/rollup/plugins/issues/1709).
