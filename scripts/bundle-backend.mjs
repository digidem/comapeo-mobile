#!/usr/bin/env node

// @ts-check
import {rollup} from 'rollup';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';

const [entry, outfile] = process.argv.slice(2);

/** @type {import('rollup').RollupOptions} */
const inputOptions = {
  external: ['rn-bridge'],
  input: entry,
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
    alias(),
  ],
};

/** @type {import('rollup').OutputOptions} */
const outputOptions = {
  file: outfile,
  format: 'cjs',
};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
  await bundle.close();
}

build();
