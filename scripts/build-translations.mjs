#!/usr/bin/env node

// @ts-check

/**
 * Uses @formatjs/cli-lib and its built-in CrowdIn messages formatter to compile extracted messages for usage in react-intl.
 * The primary difference between this and using @format/cli directly is that this consolidates messages from all languages
 * and compiles them to a single JSON file, which we load into memoryin its entirety into memory when the application starts.
 *
 * By contrast, the CLI creates a JSON file per language, which is done under the assumption that the application loads these files
 * lazily based on the active language, which is usually the preferred approach and something we should eventually switch to
 * (see https://github.com/digidem/mapeo-mobile/discussions/828).
 */

import {compile} from '@formatjs/cli-lib';
import {glob} from 'glob';
import {mkdirSync} from 'node:fs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {rimraf} from 'rimraf';

import LANGUAGE_NAME_TRANSLATIONS from '../src/frontend/languages.json' assert {type: 'json'};

const PROJECT_ROOT_DIR_PATH = new URL('../', import.meta.url).pathname;
const TRANSLATIONS_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'translations');
const TRANSLATIONS_OUTPUT_PATH = path.join(
  TRANSLATIONS_DIR_PATH,
  'messages.json',
);
const CROWDIN_FORMATTER_PATH = new URL(
  import.meta.resolve('@formatjs/cli-lib/src/formatters/crowdin.js'),
).pathname;

// We want to preserve the translations/ directory
await rimraf(`${TRANSLATIONS_DIR_PATH}/*`, {glob: true, preserveRoot: true});

try {
  mkdirSync(TRANSLATIONS_DIR_PATH);
} catch (_) {
  // Translations directory already exists
}

const files = await glob(`${PROJECT_ROOT_DIR_PATH}/messages/**/*.json`);

const compiled = await Promise.all(
  files.map(async f => {
    const lang = path.parse(f).name;
    const compiledMessages = await compile([f], {
      ast: true,
      format: CROWDIN_FORMATTER_PATH,
    });

    return [lang, JSON.parse(compiledMessages)];
  }),
);

const translations = {};

for (const [lang, messages] of compiled) {
  if (!LANGUAGE_NAME_TRANSLATIONS[lang]) {
    console.warn(`Locale '${lang}' has no language name defined in \`src/frontend/languages.json\`,
  so it will not appear as a language option in CoMapeo.
  Add the language name in English and the native language to \`languages.json\`
  in order to allow users to select '${lang}' in CoMapeo`);
  }

  translations[lang] = messages;
}

await writeFile(TRANSLATIONS_OUTPUT_PATH, JSON.stringify(translations));

console.log(`Successfully built translations to ${TRANSLATIONS_OUTPUT_PATH}\n`);
