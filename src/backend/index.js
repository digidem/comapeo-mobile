import { init } from './src/app.js'
import parseArgs from './src/args.js'

// We define this here so we don't need to do additional bundling adjustments to get the path correct when running on the device
// This assumes that we keep the relevant directory as part of the built assets when building for nodejs mobile
// (see `KEEP_THESE` variable in build-backend.mjs)
const MIGRATIONS_FOLDER_PATH = new URL(
  './node_modules/@comapeo/core/drizzle',
  import.meta.url,
).pathname

const DEFAULT_CONFIG_PATH = new URL(
  'node_modules/@comapeo/default-categories/dist/comapeo-default-categories.comapeocat',
  import.meta.url,
).pathname

try {
  const { version, rootKey } = parseArgs()

  // Do not await this as we want this to run indefinitely
  init({
    version,
    rootKey: Buffer.from(rootKey, 'hex'),
    migrationsFolderPath: MIGRATIONS_FOLDER_PATH,
    defaultConfigPath: DEFAULT_CONFIG_PATH,
  }).catch((err) => {
    console.error('Server startup error:', err)
  })
} catch (err) {
  console.error('Server startup error:', err)
}
