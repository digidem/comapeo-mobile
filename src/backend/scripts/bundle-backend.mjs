#!/usr/bin/env node

// @ts-check
import {rollup} from 'rollup';
// import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import {nodeResolve} from '@rollup/plugin-node-resolve';
// import typescript from '@rollup/plugin-typescript';
import {babel} from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

const [entry, outfile] = process.argv.slice(2);

/** @type {import('rollup').RollupOptions} */
const inputOptions = {
  external: ['rn-bridge'],
  input: entry,
  plugins: [
    // alias({
    //   entries: {
    //     'sodium-native': 'sodium-javascript',
    //     'sodium-universal': 'sodium-javascript',
    //   },
    // }),
    replace({
      preventAssignment: true,
      'sodium-native': 'sodium-javascript',
      'sodium-universal': 'sodium-javascript',
    }),
    json(),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs({ignoreDynamicRequires: true}),
    babel({babelHelpers: 'bundled'}),
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
