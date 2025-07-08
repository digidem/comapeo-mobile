#!/usr/bin/env node

import path from 'node:path';
import fs from 'node:fs';
import {readFile, writeFile} from 'node:fs/promises';

import LANGUAGE_NAME_TRANSLATIONS from '../src/frontend/languages.json' with {type: 'json'};

const PROJECT_ROOT_DIR_PATH = new URL('../', import.meta.url).pathname;
const TRANSLATIONS_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'translations');

const TRANSLATIONS_OUTPUT_PATH = path.join(
  TRANSLATIONS_DIR_PATH,
  'messages.json',
);

await run();

async function run() {
  fs.rmSync(TRANSLATIONS_DIR_PATH, {force: true, recursive: true});
  fs.mkdirSync(TRANSLATIONS_DIR_PATH);

  const messages = await loadMessages();
  const translations = convertMessagesToTranslations(messages);

  await writeFile(
    TRANSLATIONS_OUTPUT_PATH,
    JSON.stringify(translations, null, 2),
  );

  console.log(`Successfully built translations to ${TRANSLATIONS_OUTPUT_PATH}`);
}

////////////////////////////// Helpers //////////////////////////////

/**
 * @returns {Promise<{ [lang: string]: unknown }>}
 */
async function loadMessages() {
  const files = fs.readdirSync(path.join(PROJECT_ROOT_DIR_PATH, 'messages'), {
    withFileTypes: true,
  });

  /** @type {Array<[string, any]>} */
  const loadedMessages = await Promise.all(
    files.map(async file => {
      const lang = path.parse(file.name).name;
      const msgs = JSON.parse(await readFile(path.join(file.path, file.name)));
      return [lang, msgs];
    }),
  );

  const result = {};

  for (const [lang, msgs] of loadedMessages) {
    // If a language is added to Crowdin, but has no translated messages,
    // Crowdin still creates an empty file, so we just ignore it
    if (Object.keys(msgs).length === 0) continue;

    if (!result[lang]) {
      result[lang] = msgs;
    } else {
      result[lang] = {...result[lang], ...msgs};
    }
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
      result[lang][key] = msgs[key].message;
    });
  }

  return result;
}
