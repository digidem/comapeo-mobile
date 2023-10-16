#!/usr/bin/env node

import {$} from 'execa';
import path from 'path';
import fs from 'fs';
import {downloadPrebuilds} from './download-prebuilds.mjs';

const $$ = $({stdio: 'inherit'});

console.group('[SETUP]');

// Ensure we start in the right place
process.chdir(new URL('../', import.meta.url).pathname);

console.log('Preparing nodejs-assets directory...');

fs.mkdirSync('./nodejs-assets', {recursive: true});

await Promise.all([
  $$`rm -rf ./nodejs-assets/nodejs-project`,
  $$`rm -rf ./nodejs-assets/backend`,
]);

fs.cpSync('./src/backend', './nodejs-assets/backend', {recursive: true});
fs.mkdirSync('./nodejs-assets/nodejs-project/node_modules', {recursive: true});

if (fs.existsSync('./nodejs-assets/BUILD_NATIVE_MODULES.txt')) {
  console.log('Build native modules on');
} else {
  fs.writeFileSync('./nodejs-assets/BUILD_NATIVE_MODULES.txt', '1', {
    encoding: 'utf-8',
  });
  console.log("Set build native modules on")
}

console.groupEnd();

// ------------------------------------------------

console.group('[BUILD]');

console.log('Installing deps...');

// The install / postinstall scripts for backend dependencies are currently all
// for generating / downloading builds of native modules.
// We don't need to run these scripts since we pull prebuilds in a later step.
await $$({
  cwd: './nodejs-assets/backend',
})`npm ci --ignore-scripts`;

//  Setting --ignore-scripts above means that the postinstall script will not run (needed for patch-package)
await $$({
  cwd: './nodejs-assets/backend',
})`npm run postinstall`;

console.log('Creating bundle...');

await $$({cwd: './nodejs-assets/backend'})`npm run build`;

console.log(
  'Moving relevant files to nodejs-assets/nodejs-project directory...',
);

const KEEP_THESE = [
  'package.json',
  'index.bundle.js',
  'loader.js',
  // Static folders referenced by @mapeo/core code
  'node_modules/@mapeo/core/drizzle',
];

for (const name of KEEP_THESE) {
  const source = path.join('./nodejs-assets/backend/', name);
  const destination = path.join(
    './nodejs-assets/nodejs-project',
    name === 'index.bundle.js' ? 'index.js' : name,
  );

  fs.cpSync(source, destination, {recursive: true});
}

await $$`rm -rf ./nodejs-assets/backend`;

console.groupEnd();

// ------------------------------------------------

console.group('[PREBUILDS]');

await downloadPrebuilds();

console.groupEnd();

// ------------------------------------------------

console.log('DONE!');
