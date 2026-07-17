#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {$} from 'execa';

import {downloadPrebuilds} from './download-prebuilds.mjs';

const nodejsAssetsDirectory = fileURLToPath(
  new URL('../nodejs-assets', import.meta.url),
);
const nodejsAssetsBackendDirectory = path.join(
  nodejsAssetsDirectory,
  'backend',
);
const nodejsAssetsProjectDirectory = path.join(
  nodejsAssetsDirectory,
  'nodejs-project',
);

const backendSourceDirectory = fileURLToPath(
  new URL('../src/backend', import.meta.url),
);

const {
  values: {prod},
} = parseArgs({
  options: {prod: {type: 'boolean'}},
});

const $$ = $({stdio: 'inherit'});

console.group('[SETUP]');

// Ensure we start in the right place
process.chdir(fileURLToPath(new URL('../', import.meta.url)));

console.log('Preparing nodejs-assets directory...');

fs.mkdirSync(nodejsAssetsDirectory, {recursive: true});

await Promise.all([
  $$`rm -rf ${nodejsAssetsProjectDirectory}`,
  $$`rm -rf ${nodejsAssetsBackendDirectory}`,
]);

fs.cpSync(backendSourceDirectory, nodejsAssetsBackendDirectory, {
  recursive: true,
});
fs.mkdirSync(path.join(nodejsAssetsProjectDirectory, 'node_modules'), {
  recursive: true,
});

fs.writeFileSync(
  path.join(nodejsAssetsDirectory, 'BUILD_NATIVE_MODULES.txt'),
  '1',
  {encoding: 'utf-8'},
);
console.log('Set build native modules on');

console.groupEnd();

// ------------------------------------------------

console.group('[BUILD]');

console.log('Installing deps...');

// The install / postinstall scripts for backend dependencies are currently all
// for generating / downloading builds of native modules.
// We don't need to run these scripts since we pull prebuilds in a later step.
await $$({
  cwd: nodejsAssetsBackendDirectory,
})`npm ci --ignore-scripts`;

//  Setting --ignore-scripts above means that the postinstall script will not run (needed for patch-package)
await $$({
  cwd: nodejsAssetsBackendDirectory,
})`npm run postinstall`;

if (prod) {
  await $$({cwd: nodejsAssetsBackendDirectory})`npm run build -- --minify`;
} else {
  await $$({cwd: nodejsAssetsBackendDirectory})`npm run build`;
}

console.log(
  'Moving relevant files to nodejs-assets/nodejs-project directory...',
);

// TODO: Figure out how to know if module uses N-API at runtime
const NATIVE_MODULES = [
  {name: 'better-sqlite3', usesNapi: false},
  // Native module seems to cause issues so do not need for now: https://github.com/digidem/comapeo-mobile/issues/1096
  // {name: 'crc-native', usesNapi: true},
  {name: 'fs-native-extensions', usesNapi: true},
  {name: 'quickbit-native', usesNapi: true},
  {name: 'simdle-native', usesNapi: true},
  // The tree contains sodium-native at two incompatible versions (4.x hoisted
  // for the fallback old core, 5.x nested under the hypercore 11 packages);
  // every copy needs its own matching prebuild at its own path. Must stay in
  // sync with `preserveNestingFor` in src/backend/rollup.config.js.
  {name: 'sodium-native', usesNapi: true, allCopies: true},
  {name: 'rocksdb-native', usesNapi: true},
];

/**
 * Find every installed copy of a package in the staging tree (hoisted and
 * nested). The dependency tree can contain the same native module at multiple
 * versions — e.g. sodium-native 4.x hoisted for the fallback old core and
 * 5.x copies nested under the hypercore 11 packages — and each copy must
 * ship its own matching prebuild at its own path.
 * @param {string} name
 * @returns {string[]} absolute paths to each copy's package.json
 */
function findPackageJsons(name) {
  /** @type {string[]} */
  const found = [];
  walk(path.join(nodejsAssetsBackendDirectory, 'node_modules'));
  if (found.length === 0) {
    throw new Error(`No installed copies of ${name} found`);
  }
  return found;

  /** @param {string} nodeModulesDir */
  function walk(nodeModulesDir) {
    const pkgJsonPath = path.join(
      nodeModulesDir,
      ...name.split('/'),
      'package.json',
    );
    if (fs.existsSync(pkgJsonPath)) {
      found.push(pkgJsonPath);
    }
    for (const packageDir of listPackageDirs(nodeModulesDir)) {
      const nested = path.join(packageDir, 'node_modules');
      if (fs.existsSync(nested)) {
        walk(nested);
      }
    }
  }
}

/**
 * @param {string} nodeModulesDir
 * @returns {string[]} absolute paths of the package directories inside
 */
function listPackageDirs(nodeModulesDir) {
  /** @type {string[]} */
  const dirs = [];
  /** @type {import('node:fs').Dirent[]} */
  let entries;
  try {
    entries = fs.readdirSync(nodeModulesDir, {withFileTypes: true});
  } catch {
    return dirs;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
    const entryPath = path.join(nodeModulesDir, entry.name);
    if (entry.name.startsWith('@')) {
      for (const scoped of fs.readdirSync(entryPath, {withFileTypes: true})) {
        if (scoped.isDirectory()) {
          dirs.push(path.join(entryPath, scoped.name));
        }
      }
    } else {
      dirs.push(entryPath);
    }
  }
  return dirs;
}

const NATIVE_MODULE_COPIES = NATIVE_MODULES.flatMap(m => {
  const copies = findPackageJsons(m.name);
  // Without `allCopies`, only the hoisted copy ships prebuilds (nested copies
  // are pointed at the hoisted path by rollup-plugin-native-paths).
  const selected = m.allCopies ? copies : copies.slice(0, 1);
  return selected.map(pkgJsonPath => ({...m, pkgJsonPath}));
});

const KEEP_THESE = [
  'package.json',
  // Packaged backend code
  'dist',
  // Static folders referenced by @comapeo/core code
  'node_modules/@comapeo/core/drizzle',
  // zip file that is the default config
  'node_modules/@comapeo/default-categories/dist/comapeo-default-categories.comapeocat',
  // Offline fallback map
  'node_modules/@comapeo/fallback-smp',
  // Bare's require.addon() needs the package.json present for native modules
  // At build time we use the presence of binding.gyp to determine whether
  // native addons use node-gyp-build for addon resolution
  ...NATIVE_MODULE_COPIES.flatMap(m => {
    const pkgPathAbs = m.pkgJsonPath;
    const pkgPathRel = path.relative(nodejsAssetsBackendDirectory, pkgPathAbs);
    const bindingGypPath = path.join(path.dirname(pkgPathRel), 'binding.gyp');
    if (
      fs.existsSync(path.join(nodejsAssetsBackendDirectory, bindingGypPath))
    ) {
      return [pkgPathRel, bindingGypPath];
    } else {
      return pkgPathRel;
    }
  }),
];

for (const name of KEEP_THESE) {
  const source = path.join(nodejsAssetsBackendDirectory, name);
  const destination =
    name === 'dist'
      ? nodejsAssetsProjectDirectory
      : path.join(nodejsAssetsProjectDirectory, name);
  fs.cpSync(source, destination, {recursive: true});
}

console.log('Downloading native prebuilds...');

await downloadPrebuilds(
  NATIVE_MODULE_COPIES.map(m => {
    const {version} = JSON.parse(fs.readFileSync(m.pkgJsonPath, 'utf-8'));

    const packageDir = path.relative(
      nodejsAssetsBackendDirectory,
      path.dirname(m.pkgJsonPath),
    );

    return {name: m.name, usesNapi: m.usesNapi, version, packageDir};
  }),
);

await $$`rm -rf ${nodejsAssetsBackendDirectory}`;

console.groupEnd();

// ------------------------------------------------

console.log('DONE!');
