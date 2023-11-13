- [ ] Remove explicit dep of `@mapeo/sqlite-indexer`

  - Needed because @mapeo/core@9.0.0-alpha.1 doesn't include the `deleted` field in the schemas, causing @mapeo/sqlite-indexer@1.0.0-alpha.7 to complain. Had to pin to alpha.6
  - Need to publish @mapeo/core@9.0.0-alpha.2

- [ ] Remove explicit deps of `sodium-native` and `@mapeo/crypto`

  - Needed because @mapeo/core@9.0.0-alpha.1 has a dependency on two different version of `sodium-native` (v3 and v4). We only want v4 so we don't need to include an extra native build.
  - Need to publish @mapeo/core@9.0.0-alpha.2

- [ ] Remove explicit dep of `@mapeo/schema@3.0.0-next.9`

  - Needed because @mapeo/core@9.0.0-alpha.1 was released when @mapeo/schema@3.0.0-next.9 the most recent, but recent releases of schema has introduced breaking changes that this core release does not account for. (was getting a SQLITE error about a missing `deleted` column)

- [ ] Update `coreStorage` opt passed to MapeoManager creation in `src/backend/app.js`

  - Needed because of issue in @mapeo/core. Fixed by https://github.com/digidem/mapeo-core-next/commit/a32cab03c0111e41db44b89abfc8776657dd1b9e#diff-5970f83b40c59dad8c8bdddc56bfbe3cfebfadddd6b3d54e9df139f010d3c3adR106
  - Remove `random-access-file` from deps
  - Pass `indexDir` directly to `coreStorage` opt as a string
