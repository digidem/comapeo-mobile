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

const {
  values: { minify: shouldMinify },
} = parseArgs({
  options: {
    minify: { type: 'boolean' },
  },
})

const projectRoot = path.join(__dirname, '..')

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  alias({
    entries: [
      // @comapeo/core (indirectly) depends on @node-rs/crc32, which can't be rolled up.
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

async function buildMain() {
  const input = path.join(projectRoot, 'index.js')
  const output = path.join(projectRoot, 'index.bundle.js')
  const bundle = await rollup({
    external: ['rn-bridge'],
    input,
    plugins,
  })
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
}

async function buildLoader() {
  const input = path.join(projectRoot, 'loader.js')
  const output = path.join(projectRoot, 'loader.bundle.js')
  const bundle = await rollup({
    external: ['rn-bridge', './index.js'],
    input,
    plugins,
  })
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
}

async function buildImportHook() {
  const input = path.join(
    projectRoot,
    'node_modules/import-in-the-middle/hook.mjs',
  )
  const output = path.join(projectRoot, 'import-in-the-middle-hook.bundle.mjs')
  const bundle = await rollup({
    input,
    plugins,
  })
  await bundle.write({ file: output, format: 'esm' })
  await bundle.close()
}

buildMain()
buildLoader()
buildImportHook()
