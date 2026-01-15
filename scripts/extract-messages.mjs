#!/usr/bin/env node

import {extract} from '@formatjs/cli-lib';
import fs from 'node:fs/promises';
import stringify from 'json-stable-stringify';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

/** @import { FormatFn, CompileFn } from '@formatjs/cli-lib' */
/**
 * @typedef { Record<string, {message: string, description?: string}> } CrowdinJson
 */

const priorities = /** @type {const} */ (['core', 'primary', 'secondary']);
const DEFAULT_PRIORITY = 'primary';
const PROJECT_ROOT_DIR_PATH = fileURLToPath(new URL('../', import.meta.url));
const SOURCE_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'src', 'frontend');
const MESSAGES_DIR_PATH = path.join(PROJECT_ROOT_DIR_PATH, 'messages', 'en-US');

await run();

async function run() {
  const entries = await fs.readdir(SOURCE_DIR_PATH, {
    withFileTypes: true,
    recursive: true,
  });
  const files = entries
    .filter(
      entry =>
        entry.isFile() &&
        (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) &&
        !entry.name.endsWith('.d.ts'),
    )
    .map(entry => `${entry.path}/${entry.name}`);

  const output = await extract(files, {
    pragma: 'intl',
    flatten: true,
    format: {format, serialize},
  });
  for (const priority of priorities) {
    if (!output[priority]) {
      continue;
    }
    const outputPath = path.join(MESSAGES_DIR_PATH, `${priority}.json`);
    await fs.writeFile(outputPath, stringify(output[priority], {space: 2}));
  }
}

/** @type {FormatFn<CrowdinJson>} */
function format(msgs) {
  /** @type {CrowdinJson} */
  const results = {};
  for (const [id, msg] of Object.entries(msgs)) {
    const priority = msg.meta?.priority || DEFAULT_PRIORITY;
    if (!priorities.includes(priority)) {
      throw new Error(
        `Invalid priority "${priority}" for message id "${id}". Valid priorities are: ${priorities.join(
          ', ',
        )}`,
      );
    }
    results[priority] = results[priority] || {};
    results[priority][id] = {
      message: msg.defaultMessage,
      description:
        typeof msg.description === 'string'
          ? msg.description
          : JSON.stringify(msg.description),
    };
  }
  return results;
}

// Don't serialize in the extract function, we'll serialize after separating by priority
function serialize(obj) {
  return obj;
}
