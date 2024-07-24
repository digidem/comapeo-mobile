#!/usr/bin/env node

import {$} from 'execa';
import fs from 'node:fs';
import path from 'node:path';

// NOTE: we currently don't support building for intel arch (android-x64)
const TARGETS = ['android-arm', 'android-arm64'];

// TODO: Figure out how to know if module uses N-API at runtime
const NATIVE_MODULES = [
  {name: 'better-sqlite3', version: '8.7.0', usesNapi: false},
  {name: 'crc-native', version: '1.0.7', usesNapi: true},
  {name: 'fs-native-extensions', version: '1.2.3', usesNapi: true},
  {name: 'quickbit-native', version: '2.2.0', usesNapi: true},
  {name: 'simdle-native', version: '1.2.0', usesNapi: true},
  {name: 'sodium-native', version: '4.0.4', usesNapi: true},
  {name: 'udx-native', version: '1.7.12', usesNapi: true},
];

// Uncomment line below if you want to run this script directly
// await downloadPrebuilds();

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

  const {abi: NODE_ABI} = getNodeJsMobileNodeVersions();

  return Promise.all(
    NATIVE_MODULES.map(async ({name, version, usesNapi}) => {
      if (verbose) {
        console.log(`${name}: prebuilds start (${version})`);
      }

      await Promise.all(
        TARGETS.map(async target => {
          const targetDir = path.join(name, 'prebuilds', target);

          fs.mkdirSync(targetDir, {recursive: true});

          const artifactInfo = getArtifactInfo({
            name,
            version,
            target,
            nodeAbi: usesNapi ? undefined : NODE_ABI,
          });

          if (verbose) {
            console.log(`${name}: prebuild start (${target})`);
          }

          await $({
            cwd: targetDir,
          })`curl --fail --location ${artifactInfo.url} --output ${artifactInfo.name}`;

          await $({
            cwd: targetDir,
          })`tar xzf ${artifactInfo.name} --directory .`;

          fs.unlinkSync(path.join(targetDir, artifactInfo.name));

          // better-sqlite3 includes an additional native module for testing purposes
          // removing since it's not needed and also causes issues with nodejs-mobile-react-native
          if (name === 'better-sqlite3') {
            fs.unlinkSync(path.join(targetDir, 'test_extension.node'));
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

function getNodeJsMobileNodeVersions() {
  const nodeVersionFilePath = new URL(
    'android/libnode/include/node/node_version.h',
    new URL(import.meta.resolve('nodejs-mobile-react-native')),
  ).pathname;

  const content = fs.readFileSync(nodeVersionFilePath, 'utf-8');

  const major = content.match(/#define NODE_MAJOR_VERSION (.+)/)[1];
  const minor = content.match(/#define NODE_MINOR_VERSION (.+)/)[1];
  const patch = content.match(/#define NODE_PATCH_VERSION (.+)/)[1];
  const abi = content.match(/#define NODE_MODULE_VERSION (.+)/)[1];

  return {
    major,
    minor,
    patch,
    abi,
  };
}

/**
 * @param {{name: string, version: string, target: string, nodeAbi?: string}} opts
 * @returns {{name: string, url: string}}
 */
function getArtifactInfo({name, version, target, nodeAbi}) {
  const assetName = nodeAbi
    ? `${name}-${version}-node-${nodeAbi}-${target}.tar.gz`
    : `${name}-${version}-${target}.tar.gz`;

  return {
    name,
    url: `https://github.com/digidem/${name}-nodejs-mobile/releases/download/${version}/${assetName}`,
  };
}
