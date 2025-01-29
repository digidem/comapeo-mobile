#!/usr/bin/env node

import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {$} from 'execa';

import {downloadPrebuilds} from './download-prebuilds.mjs';

const require = createRequire(import.meta.url);

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

const KEEP_THESE = [
  'package.json',
  'index.bundle.js',
  'loader.js',
  // Static folders referenced by @comapeo/core code
  'node_modules/@comapeo/core/drizzle',
  // zip file that is the default config
  'node_modules/@mapeo/default-config/dist/mapeo-default-config.comapeocat',
  // Offline fallback map
  'node_modules/@comapeo/fallback-smp',
];

for (const name of KEEP_THESE) {
  const source = path.join(nodejsAssetsBackendDirectory, name);
  const destination = path.join(
    nodejsAssetsProjectDirectory,
    name === 'index.bundle.js' ? 'index.js' : name,
  );

  fs.cpSync(source, destination, {recursive: true});
}

console.log('Downloading native prebuilds...');

// TODO: Figure out how to know if module uses N-API at runtime
const NATIVE_MODULES = [
  {name: 'better-sqlite3', usesNapi: false},
  {name: 'crc-native', usesNapi: true},
  {name: 'fs-native-extensions', usesNapi: true},
  {name: 'quickbit-native', usesNapi: true},
  {name: 'simdle-native', usesNapi: true},
  {name: 'sodium-native', usesNapi: true},
];

await downloadPrebuilds(
  NATIVE_MODULES.map(m => {
    const pkgJsonPath = require.resolve(`${m.name}/package.json`, {
      paths: [nodejsAssetsBackendDirectory],
    });

    const {version} = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));

    return {...m, version};
  }),
);

await $$`rm -rf ${nodejsAssetsBackendDirectory}`;

console.groupEnd();

// ------------------------------------------------

console.log('DONE!');
