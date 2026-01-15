#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs/promises';
import {compile} from '@formatjs/cli-lib';
import {fileURLToPath} from 'node:url';
import LANGUAGE_NAME_TRANSLATIONS from '../src/frontend/languages.json' with {type: 'json'};

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
    promises.push(
      compileFolder(inputPath, outputPath).then(hasTranslations => {
        if (hasTranslations && !LANGUAGE_NAME_TRANSLATIONS[locale]) {
          throw new Error(`Locale '${locale}' has no language name defined in \`src/frontend/languages.json\`,
so it will not appear as a language option in CoMapeo.
Add the language name in English and the native language to \`languages.json\`
in order to allow users to select '${locale}' in CoMapeo`);
        }
      }),
    );
  }

  await Promise.all(promises);

  console.log(`Successfully built translations to ${TRANSLATIONS_DIR_PATH}`);
}

/**
 * Compile all JSON files in a folder into a single translation file
 * @returns {Promise<boolean>} whether any translations were compiled
 */
async function compileFolder(inputPath, outputPath) {
  const entries = await fs.readdir(inputPath, {withFileTypes: true});
  const messagesPaths = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.json'))
    .map(entry => path.join(inputPath, entry.name));
  const compiled = await compile(messagesPaths, {
    ast: true,
    format: 'crowdin',
  });
  if (compiled.length < 5) {
    // ignore empty translations
    return false;
  }
  await fs.writeFile(outputPath, compiled);
  return true;
}
