#!/usr/bin/env node
import { parseArgs } from 'util'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esmShim from '@rollup/plugin-esm-shim'
import { minify } from 'rollup-plugin-esbuild'
import nativePaths from './rollup-plugin-native-paths.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { values } = parseArgs({
  options: {
    entry: { type: 'string' },
    output: { type: 'string' },
    minify: { type: 'boolean' },
  },
})

const { entry, output, minify: shouldMinify } = values

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  alias({
    entries: [
      // @mapeo/core (indirectly) depends on @node-rs/crc32, which can't be rolled up.
      // Replace it with a pure JavaScript implementation.
      {
        find: '@node-rs/crc32',
        replacement: path.join(__dirname, '..', 'src', 'node-rs-crc32-shim.js'),
      },
    ],
  }),
  nativePaths(),
  commonjs({
    ignoreDynamicRequires: true,
  }),
  esmShim(),
  nodeResolve({ preferBuiltins: true }),
  json(),
]

if (shouldMinify) {
  plugins.push(minify())
}

async function build() {
  const bundle = await rollup({
    external: ['rn-bridge'],
    input: entry,
    plugins,
  })
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
}

build()
