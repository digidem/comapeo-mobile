#!/usr/bin/env node

/**
 * Extracts messages from source files and splits them into two files:
 *   messages/en-US/primary.json   — strings marked as primary (id starts with "$1")
 *   messages/en-US/secondary.json — all other strings
 *
 * Primary strings are the ones that will be prioritized for translation in Crowdin.
 */

import path from 'node:path';
import fs from 'node:fs';
import {writeFile} from 'node:fs/promises';
import {execSync} from 'node:child_process';

const PROJECT_ROOT = new URL('../', import.meta.url).pathname;
const OUT_DIR = path.join(PROJECT_ROOT, 'messages', 'en-US');
const TEMP_FILE = path.join(OUT_DIR, '_all.json');
const PRIMARY_FILE = path.join(OUT_DIR, 'primary.json');
const SECONDARY_FILE = path.join(OUT_DIR, 'secondary.json');

fs.mkdirSync(OUT_DIR, {recursive: true});

// Extract all messages into a temporary combined file using the crowdin format.
// --throws causes the command to fail if two files define the same id with different
// defaultMessage or description (identical duplicates are harmless and allowed).
execSync(
  `npx formatjs extract 'src/frontend/**/*.{ts,tsx}' --ignore='**/*.d.ts' --format crowdin --throws --out-file '${TEMP_FILE}'`,
  {cwd: PROJECT_ROOT, stdio: 'inherit'},
);

const all = JSON.parse(fs.readFileSync(TEMP_FILE, 'utf8'));

const primary = {};
const secondary = {};

for (const [key, value] of Object.entries(all)) {
  if (key.startsWith('$1')) {
    primary[key] = value;
  } else {
    secondary[key] = value;
  }
}

fs.unlinkSync(TEMP_FILE);

await writeFile(PRIMARY_FILE, JSON.stringify(primary, null, 2));
await writeFile(SECONDARY_FILE, JSON.stringify(secondary, null, 2));

console.log(
  `Extracted ${Object.keys(primary).length} primary strings → messages/en-US/primary.json`,
);
console.log(
  `Extracted ${Object.keys(secondary).length} secondary strings → messages/en-US/secondary.json`,
);
