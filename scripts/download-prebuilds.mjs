#!/usr/bin/env node

import {$} from 'execa';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);

// NOTE: we currently don't support building for intel arch (android-x64)
const TARGETS = ['android-arm', 'android-arm64', 'android-x64'];

// TODO: Figure out how to know if module uses N-API at runtime
const NATIVE_MODULES = [
  {name: 'better-sqlite3', usesNapi: false},
  {name: 'crc-native', usesNapi: true},
  {name: 'fs-native-extensions', usesNapi: true},
  {name: 'quickbit-native', usesNapi: true},
  {name: 'simdle-native', usesNapi: true},
  {name: 'sodium-native', usesNapi: true},
];

// Uncomment line below if you want to run this script directly
// await downloadPrebuilds({verbose: true});

/**
 * @param {{verbose?: boolean}} opts
 */
export async function downloadPrebuilds({verbose} = {verbose: false}) {
  const backendRootUrl = new URL('../src/backend/', import.meta.url);
  const nodejsProjectUrl = new URL(
    '../nodejs-assets/nodejs-project/',
    import.meta.url,
  );

  const {abi: NODE_ABI} = getNodeJsMobileNodeVersions();

  return Promise.all(
    NATIVE_MODULES.map(async ({name, usesNapi}) => {
      const pkgJsonPath = require.resolve(`${name}/package.json`, {
        paths: [fileURLToPath(backendRootUrl)],
      });
      const {version} = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      if (verbose) {
        console.log(`${name}: prebuilds start (${version})`);
      }
      const prebuildsDir = fileURLToPath(
        new URL(`node_modules/${name}/prebuilds/`, nodejsProjectUrl),
      );
      fs.rmSync(prebuildsDir, {recursive: true, force: true});

      await Promise.all(
        TARGETS.map(async target => {
          const targetDir = path.join(prebuildsDir, target);

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
  );
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
