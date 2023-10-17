#!/usr/bin/env node

import {rollup} from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import esmShim from '@rollup/plugin-esm-shim';

const [entry, outfile] = process.argv.slice(2);

/** @type {import('rollup').RollupOptions} */
const inputOptions = {
  external: ['rn-bridge'],
  input: entry,
  plugins: [commonjs(), esmShim(), nodeResolve({preferBuiltins: true}), json()],
};

/** @type {import('rollup').OutputOptions} */
const outputOptions = {file: outfile, format: 'esm'};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

build();
