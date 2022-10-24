#!/usr/bin/env node

// @ts-check
import {rollup} from 'rollup';

/** @type {import('rollup').RollupOptions} */
const inputOptions = {};

const outputOptionsList = [];

async function build() {
  /** @type {import('rollup').RollupBuild} */
  let bundle;
  let buildFailed = false;

  try {
    bundle = await rollup(inputOptions);

    await generateOutputs(bundle);
  } catch (err) {
    buildFailed = true;

    console.error(error);
  }

  if (bundle) {
    await bundle.close();
  }

  process.exit(buildFailed ? 1 : 0);
}

/**
 * @param {import('rollup').RollupBuild} bundle
 */
async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
  }
}
