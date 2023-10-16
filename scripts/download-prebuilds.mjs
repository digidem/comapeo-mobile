#!/usr/bin/env node

import {$} from 'execa';
import {mkdirSync, unlinkSync} from 'fs';
import path from 'path';

const NODE_ABI = process.versions.modules;
const TARGETS = ['android-arm', 'android-arm64', 'android-x64'];
const NATIVE_MODULES = {
  'better-sqlite3': '8.7.0',
  'crc-native': '1.0.7',
  'fs-native-extensions': '1.2.3',
  'quickbit-native': '2.2.0',
  'simdle-native': '1.2.0',
  'sodium-native': '4.0.4',
  'udx-native': '1.7.5',
};

// Uncomment line below if you want to run this script directly
// await downloadPrebuilds()

/**
 * @param {{verbose?: boolean}} opts
 */
export async function downloadPrebuilds({verbose} = {verbose: false}) {
  const prevCwd = process.cwd();

  process.chdir(
    path.resolve(
      new URL('../nodejs-assets/nodejs-project/node_modules', import.meta.url)
        .pathname,
    ),
  );

  return Promise.all(
    Object.entries(NATIVE_MODULES).map(async ([name, version]) => {
      if (verbose) {
        console.log(`${name}: prebuilds start (${version})`);
      }

      await Promise.all(
        TARGETS.map(async target => {
          const targetDir = path.join(name, 'prebuilds', target);

          mkdirSync(targetDir, {recursive: true});

          const tarballName = getArtifactTarballName({name, version, target});
          const downloadUrl = getArtifactUrl({name, version, target});

          if (verbose) {
            console.log(`${name}: prebuild start (${target})`);
          }

          await $({
            cwd: targetDir,
          })`curl --fail --location ${downloadUrl} --output ${tarballName}`;

          await $({
            cwd: targetDir,
          })`tar xzf ${tarballName} --directory .`;

          unlinkSync(path.join(targetDir, tarballName));

          // better-sqlite3 includes an additional native module for testing purposes
          // removing since it's not needed and also causes issues with nodejs-mobile-react-native
          if (name === 'better-sqlite3') {
            unlinkSync(path.join(targetDir, 'test_extension.node'));
          }

          if (verbose) {
            console.log(`${name}: prebuild done (${target})`);
          }
        }),
      );

      if (verbose) {
        console.log(`${name}: prebuilds done (${version})`);
      }
    }),
  ).finally(() => {
    process.chdir(prevCwd);
  });
}

/**
 * @param {{name: string, version: string, target: string}} opts
 * @returns {string}
 */
function getArtifactTarballName({name, version, target}) {
  return `${name}-${version}-node-${NODE_ABI}-${target}.tar.gz`;
}

/**
 * @param {{name: string, version: string, target: string}} opts
 * @returns {string}
 */
function getArtifactUrl({name, version, target}) {
  const fileName = getArtifactTarballName({name, version, target});
  return `https://github.com/digidem/${name}-nodejs-mobile/releases/download/${version}/${fileName}`;
}
