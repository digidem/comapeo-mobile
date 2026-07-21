import {
  init,
  MIGRATIONS_FOLDER_PATH,
  OLD_MIGRATIONS_FOLDER_PATH,
  DEFAULT_CONFIG_PATH,
} from './src/app.js'
import parseArgs from './src/args.js'

try {
  const { version, rootKey, availableDiskSpace, forceSkipMigrate } = parseArgs()

  // Do not await this as we want this to run indefinitely
  init({
    version,
    rootKey: Buffer.from(rootKey, 'hex'),
    migrationsFolderPath: MIGRATIONS_FOLDER_PATH,
    oldMigrationsFolderPath: OLD_MIGRATIONS_FOLDER_PATH,
    defaultConfigPath: DEFAULT_CONFIG_PATH,
    availableDiskSpace,
    forceSkipMigrate,
  }).catch((err) => {
    console.error('Server startup error:', err)
  })
} catch (err) {
  console.error('Server startup error:', err)
}
