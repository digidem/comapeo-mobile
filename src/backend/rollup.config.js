import process from 'node:process'
import * as path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esmShim from '@rollup/plugin-esm-shim'
import { minify } from 'rollup-plugin-esbuild'
import nativePaths from './rollup-plugins/rollup-plugin-native-paths.mjs'
import importHook from './rollup-plugins/rollup-plugin-import-hook.mjs'
import { sentryRollupPlugin } from '@sentry/rollup-plugin'

const require = createRequire(import.meta.url)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const env = process.env.NODE_ENV || 'development'

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [
  alias({
    entries: [
      // @comapeo/core (indirectly) depends on @node-rs/crc32, which can't be rolled up.
      // Replace it with a pure JavaScript implementation.
      {
        find: '@node-rs/crc32',
        replacement: path.join(__dirname, 'src', 'node-rs-crc32-shim.js'),
      },
    ],
  }),
  nativePaths(),
  importHook(),
  commonjs({
    ignoreDynamicRequires: true,
  }),
  esmShim(),
  nodeResolve({ preferBuiltins: true }),
  json(),
  env === 'production' && minify(),
  sentryRollupPlugin({
    authToken: process.env.SENTRY_AUTH_TOKEN,
    org: 'awana-digital',
    project: 'comapeo-backend',
  }),
]

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  external: ['rn-bridge'],
  input: {
    index: path.join(__dirname, 'index.js'),
    loader: path.join(__dirname, 'loader.js'),
    importHook: require.resolve('import-in-the-middle/hook.mjs'),
    'lib/register': require.resolve('import-in-the-middle/lib/register.js'),
  },
  output: {
    dir: path.join(__dirname, 'dist'),
    format: 'esm',
    sourcemap: true,
    entryFileNames: '[name].js',
  },
  plugins,
}

export default config
