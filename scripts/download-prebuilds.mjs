#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {$} from 'execa';

const TARGETS = ['android-arm', 'android-arm64', 'android-x64'];

/**
 * @param {Array<{ name: string, usesNapi: boolean, version: string }>} modules
 * @param {{verbose?: boolean}} opts
 */
export async function downloadPrebuilds(modules, {verbose} = {verbose: false}) {
  const nodejsProjectUrl = new URL(
    '../nodejs-assets/nodejs-project/',
    import.meta.url,
  );

  const {abi: NODE_ABI} = getNodeJsMobileNodeVersions();

  return Promise.all(
    modules.map(async ({name, usesNapi, version}) => {
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

          /** TEMPORARY FIX: bare-make builds are tagged with `-bare-make` to
           * avoid conflicts with our current releases built with node-gyp */
          const releaseTag =
            name === 'better-sqlite3' ? `${version}-bare-make` : version;

          const artifactInfo = getArtifactInfo({
            name,
            version,
            releaseTag,
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

          // better-sqlite3 bare-make builds are named better-sqlite3.node, but the module expects better_sqlite3.node
          if (name === 'better-sqlite3') {
            fs.renameSync(
              path.join(targetDir, 'better-sqlite3.node'),
              path.join(targetDir, 'better_sqlite3.node'),
            );
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
 * @param {{name: string, version: string, releaseTag: string, target: string, nodeAbi?: string}} opts
 * @returns {{name: string, url: string}}
 */
function getArtifactInfo({name, version, releaseTag, target, nodeAbi}) {
  const assetName = nodeAbi
    ? `${name}-${version}-node-${nodeAbi}-${target}.tar.gz`
    : `${name}-${version}-${target}.tar.gz`;

  return {
    name,
    url: `https://github.com/digidem/${name}-nodejs-mobile/releases/download/${releaseTag}/${assetName}`,
  };
}
