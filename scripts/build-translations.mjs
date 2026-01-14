#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs/promises';
import {compile} from '@formatjs/cli-lib';
import {fileURLToPath} from 'node:url';

const PROJECT_ROOT_DIR_PATH = fileURLToPath(new URL('../', import.meta.url));
const TRANSLATIONS_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'translations');
const MESSAGES_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'messages');

await run();

async function run() {
  await fs.rm(TRANSLATIONS_DIR_PATH, {force: true, recursive: true});
  await fs.mkdir(TRANSLATIONS_DIR_PATH);
  const localesFolders = await fs.readdir(MESSAGES_DIR_PATH, {
    withFileTypes: true,
  });
  const promises = [];

  for (const folder of localesFolders) {
    if (!folder.isDirectory()) continue;
    const locale = folder.name;
    const inputPath = path.join(MESSAGES_DIR_PATH, locale);
    const outputPath = path.join(TRANSLATIONS_DIR_PATH, `${locale}.json`);
    promises.push(compileFolder(inputPath, outputPath));
  }

  await Promise.all(promises);

  console.log(`Successfully built translations to ${TRANSLATIONS_DIR_PATH}`);
}

async function compileFolder(inputPath, outputPath) {
  const entries = await fs.readdir(inputPath, {withFileTypes: true});
  const messagesPaths = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => path.join(inputPath, entry.name));
  const compiled = await compile(messagesPaths, {
    ast: true,
    format: 'crowdin',
  });
  await fs.writeFile(outputPath, compiled);
}
