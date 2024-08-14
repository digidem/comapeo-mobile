#!/usr/bin/env node

import fs from 'node:fs';

import {supportedLocales as relativeTimeFormatSupportedLocales} from '@formatjs/intl-relativetimeformat/supported-locales.generated.js';
import {supportedLocales as pluralRulesSupportedLocales} from '@formatjs/intl-pluralrules/supported-locales.generated.js';

import languages from '../src/frontend/languages.json' assert {type: 'json'};
import messages from '../translations/messages.json' assert {type: 'json'};

build();

function build() {
  const locales = getPolyfillableLocales();

  const outputPath = new URL(
    '../src/frontend/polyfills/intl.ts',
    import.meta.url,
  ).pathname;

  writePolyfillFile(locales, outputPath);

  console.log(`Successfully added intl polyfill imports to ${outputPath}`);
}

/**
 * Calculate set of locales that can be polyfilled by the relevant @formatjs modules
 * @returns {Array<string>}
 */
function getPolyfillableLocales() {
  const comapeoSupportedLocales = Object.keys(messages).filter(locale => {
    const hasAtLeastOneTranslatedString =
      Object.keys(messages[locale]).length > 0;

    const hasTranslatedLanguageName = !!languages[locale];

    return hasAtLeastOneTranslatedString && hasTranslatedLanguageName;
  });

  const localesToPolyfill = [];

  for (const locale of comapeoSupportedLocales) {
    const canPolyfillLocale = isFullySupportedLocale(locale);

    if (!canPolyfillLocale) {
      console.warn(`Cannot polyfill data for locale: ${locale}`);
      continue;
    }

    localesToPolyfill.push(locale);
  }

  return localesToPolyfill;
}

/**
 * Writes file containing polyfill imports
 * @param {Array<string>} locales
 * @param {string} outputPath
 */
function writePolyfillFile(locales, outputPath) {
  const writer = fs.createWriteStream(outputPath, {flags: 'w'});

  writer.write(
    '// This file is automatically generated through scripts/build-intl-polyfills.mjs. Do not edit this directly!\n// If you need to rebuild it, you can run `npm run build:intl-polyfills`\n',
  );

  // Write lines to load base polyfills
  writer.write(
    createImportStatement('@formatjs/intl-getcanonicallocales/polyfill-force'),
  );
  writer.write(createImportStatement('@formatjs/intl-locale/polyfill-force'));

  writer.write('\n');

  // Write lines to load plural rules polyfill
  writer.write(
    createImportStatement('@formatjs/intl-pluralrules/polyfill-force'),
  );
  for (const locale of locales) {
    writer.write(
      createImportStatement(`@formatjs/intl-pluralrules/locale-data/${locale}`),
    );
  }

  writer.write('\n');

  // Write lines to load relative time format polyfill
  writer.write(
    createImportStatement('@formatjs/intl-relativetimeformat/polyfill-force'),
  );
  for (const locale of locales) {
    writer.write(
      createImportStatement(
        `@formatjs/intl-relativetimeformat/locale-data/${locale}`,
      ),
    );
  }

  writer.end();
}

/**
 * @param {string} locale
 * @returns {boolean}
 */
function isFullySupportedLocale(locale) {
  return (
    relativeTimeFormatSupportedLocales.includes(locale) &&
    pluralRulesSupportedLocales.includes(locale)
  );
}

/**
 * @param {string} module
 * @returns {string}
 */
function createImportStatement(module) {
  return `import "${module}";\n`;
}
