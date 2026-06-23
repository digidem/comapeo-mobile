#!/usr/bin/env node
// @ts-check

import fs from 'node:fs';
import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {compile} from '@formatjs/cli-lib';
import {includeKeys} from 'filter-obj';

import LANGUAGE_NAME_TRANSLATIONS from '../src/frontend/languages.json' with {type: 'json'};

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));
const MESSAGES_DIR = path.join(PROJECT_ROOT, 'messages');

const languageSourceDirectories = fs
  .readdirSync(MESSAGES_DIR, {withFileTypes: true})
  .filter(d => d.isDirectory());

const languageCodes = languageSourceDirectories.map(({name}) => name);

assertNoDuplicateBaseTags(languageCodes);

const TRANSLATIONS_DIR = path.join(PROJECT_ROOT, 'translations');

fs.rmSync(TRANSLATIONS_DIR, {recursive: true, force: true});
fs.mkdirSync(TRANSLATIONS_DIR);

/** @type {Array<string>} */
const importLines = [];

await Promise.all(
  languageSourceDirectories.map(async directory => {
    const languageCode = directory.name;

    if (
      !Object.prototype.hasOwnProperty.call(
        LANGUAGE_NAME_TRANSLATIONS,
        languageCode,
      )
    ) {
      console.warn(`Locale '${languageCode}' has no language name defined in \`src/frontend/languages.json\`,
so it will not appear as a language option in CoMapeo.
Add the language name in English and the native language to \`languages.json\`
in order to allow users to select '${languageCode}' in CoMapeo`);
    }

    const baseInputPath = path.join(directory.parentPath, directory.name);

    const compiled = await compile(
      [
        path.join(baseInputPath, 'primary.json'),
        path.join(baseInputPath, 'secondary.json'),
      ],
      {ast: true, format: 'crowdin'},
    );

    const parsed = JSON.parse(compiled);

    const baseTag = languageCode.split('-')[0];

    importLines.push(`  ${baseTag}: () => import('./${baseTag}.json'),`);

    // TODO: Similar to note for `assertNoDuplicateBaseTags()`, but ideally
    // messages should be compiled to the same language code, not the base tag.
    const outputFile = path.join(TRANSLATIONS_DIR, `${baseTag}.json`);

    await writeFile(outputFile, JSON.stringify(parsed), 'utf-8');

    console.log(
      `Compiled messages for ${languageCode} to ${path.relative(PROJECT_ROOT, outputFile)}`,
    );
  }),
);

await writeFile(
  path.join(TRANSLATIONS_DIR, 'index.ts'),
  `// AUTO-GENERATED — do not edit manually, run \`npm run build:translations\`

export const localeImports = {
${importLines.join('\n')}
} as const;

export type AvailableLanguageTag = keyof typeof localeImports;
`,
);

console.log(`Successfully built translations to ${TRANSLATIONS_DIR}`);

// TODO: This script shouldn't be defining outputs based on base tags.
// It's better to output to the exact language code and then have the application decide how to load
// the translations based on the base tags.
/**
 * @param {Array<string>} languageCodes
 */
function assertNoDuplicateBaseTags(languageCodes) {
  const groupedByBaseTag = Object.groupBy(languageCodes, l => {
    const baseTag = l.split('-')[0];
    return baseTag;
  });

  const duplicateBaseTags = includeKeys(
    groupedByBaseTag,
    (key, value) => (value?.length ?? 0) > 1,
  );

  if (Object.keys(duplicateBaseTags).length > 0) {
    throw new Error(
      `Language codes mapping to the same base tags found:\n\n${JSON.stringify(duplicateBaseTags, null, 2)}`,
    );
  }
}
