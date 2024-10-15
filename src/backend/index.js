import { parseArgs } from 'util'

import { init } from './src/app.js'

// We define this here so we don't need to do additional bundling adjustments to get the path correct when running on the device
// This assumes that we keep the relevant directory as part of the built assets when building for nodejs mobile
// (see `KEEP_THESE` variable in build-backend.mjs)
const MIGRATIONS_FOLDER_PATH = new URL(
  './node_modules/@comapeo/core/drizzle',
  import.meta.url,
).pathname

const DEFAULT_CONFIG_PATH = new URL(
  './node_modules/@mapeo/default-config/dist/mapeo-default-config.comapeocat',
  import.meta.url,
).pathname

try {
  const { values } = parseArgs({
    options: {
      version: { type: 'string' },
      rootKey: { type: 'string' },
      sharedStoragePath: { type: 'string' },
    },
  })

  if (typeof values.rootKey !== 'string') {
    throw new Error('backend did not receive root key from front end')
  }

  if (typeof values.sharedStoragePath !== 'string') {
    throw new Error(
      'backend did not receive shared storage path from front end',
    )
  }

  // Do not await this as we want this to run indefinitely
  init({
    version: values.version,
    rootKey: Buffer.from(values.rootKey, 'hex'),
    migrationsFolderPath: MIGRATIONS_FOLDER_PATH,
    sharedStoragePath: values.sharedStoragePath,
    defaultConfigPath: DEFAULT_CONFIG_PATH,
  }).catch((err) => {
    console.error('Server startup error:', err)
  })
} catch (err) {
  console.error('Server startup error:', err)
}
