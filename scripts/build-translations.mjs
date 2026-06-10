#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';
import {parse} from '@formatjs/icu-messageformat-parser';

import LANGUAGE_NAME_TRANSLATIONS from '../src/frontend/languages.json' with {type: 'json'};

const PROJECT_ROOT_DIR_PATH = new URL('../', import.meta.url).pathname;
const TRANSLATIONS_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'translations');

await run();

async function run() {
  fs.rmSync(TRANSLATIONS_DIR_PATH, {force: true, recursive: true});
  fs.mkdirSync(TRANSLATIONS_DIR_PATH);

  const messages = await loadMessages();
  const translations = convertMessagesToTranslations(messages);
  const locales = Object.keys(translations);

  await Promise.all(
    locales.map(lang =>
      writeFile(
        path.join(TRANSLATIONS_DIR_PATH, `${lang}.json`),
        JSON.stringify(translations[lang]),
      ),
    ),
  );

  const importLines = locales
    .map(lang => `  ${lang}: () => import('./${lang}.json'),`)
    .join('\n');

  await writeFile(
    path.join(TRANSLATIONS_DIR_PATH, 'index.ts'),
    `// AUTO-GENERATED — do not edit manually, run \`npm run build:translations\`

export const localeImports = {
${importLines}
} as const;

export type AvailableLanguageTag = keyof typeof localeImports;
`,
  );

  console.log(`Successfully built translations to ${TRANSLATIONS_DIR_PATH}`);
}

////////////////////////////// Helpers //////////////////////////////

/**
 * @returns {Promise<{ [lang: string]: unknown }>}
 */
async function loadMessages() {
  const messagesDir = path.join(PROJECT_ROOT_DIR_PATH, 'messages');
  const entries = fs.readdirSync(messagesDir, {
    withFileTypes: true,
  });

  const dirs = entries.filter(entry => entry.isDirectory());

  // Initialize all language folders (even those with no translations yet),
  // and error if two folders map to the same base language code.
  const result = {};
  const langToFolder = {};
  for (const entry of dirs) {
    const lang = entry.name.split('-')[0];
    if (result[lang]) {
      throw new Error(
        `Duplicate language code '${lang}': folders '${langToFolder[lang]}' and '${entry.name}' both map to the same code`,
      );
    }
    result[lang] = {};
    langToFolder[lang] = entry.name;
  }

  /** @type {Array<[string, any]>} */
  const loadedMessages = await Promise.all(
    dirs.flatMap(entry => {
      const lang = entry.name.split('-')[0];
      const langDir = path.join(messagesDir, entry.name);
      const langFiles = fs
        .readdirSync(langDir)
        .filter(f => f.endsWith('.json'));
      return langFiles.map(async fileName => {
        const msgs = JSON.parse(await readFile(path.join(langDir, fileName)));
        return [lang, msgs];
      });
    }),
  );

  for (const [lang, msgs] of loadedMessages) {
    // If a language is added to Crowdin, but has no translated messages,
    // Crowdin still creates an empty file, so we just ignore it
    if (Object.keys(msgs).length === 0) continue;

    result[lang] = {...result[lang], ...msgs};
  }

  return result;
}

/**
 * @param {{ [lang: string]: unknown }} messages
 */
function convertMessagesToTranslations(messages) {
  const result = {};

  for (const lang in messages) {
    if (!LANGUAGE_NAME_TRANSLATIONS[lang]) {
      console.warn(`Locale '${lang}' has no language name defined in \`src/frontend/languages.json\`,
so it will not appear as a language option in CoMapeo.
Add the language name in English and the native language to \`languages.json\`
in order to allow users to select '${lang}' in CoMapeo`);
    }
    result[lang] = {};
    const msgs = messages[lang];
    Object.keys(msgs).forEach(key => {
      if (!msgs[key].message) return;
      result[lang][key] = parse(msgs[key].message, {captureLocation: false});
    });
  }

  return result;
}
