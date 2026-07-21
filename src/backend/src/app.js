import debug from 'debug'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { createRequire } from 'module'
import { MapeoManager } from '@comapeo/core'
import { MapeoManager as FallbackMapeoManager } from 'comapeo-core-old'
import {
  checkShouldMigrate,
  migrateStorage,
  MIGRATION_REASON_NO_SPACE,
} from '@comapeo/core/migration.js'
import { createMapeoServer, createAppRpcServer } from '@comapeo/ipc/server.js'
import { createServer as createMapServer } from '@comapeo/map-server'
import { KeyManager } from '@mapeo/crypto'
import Fastify from 'fastify'
import * as Sentry from '@sentry/node'

import MessagePortLike from './message-port-like.js'
import { ServerStatus } from './status.js'

const require = createRequire(import.meta.url)
export const DEFAULT_FALLBACK_MAP_FILE_PATH =
  require.resolve('@comapeo/fallback-smp')

// Also used by the 'server:restart' listener below, so it's defined here
// instead of index.js. Rollup bundles this whole file to the project root
// (see `KEEP_THESE` in build-backend.mjs), so these paths are relative to
// that root, not to where this source file lives.
export const MIGRATIONS_FOLDER_PATH = new URL(
  './node_modules/@comapeo/core/drizzle',
  import.meta.url,
).pathname
export const OLD_MIGRATIONS_FOLDER_PATH = new URL(
  './node_modules/comapeo-core-old/drizzle',
  import.meta.url,
).pathname
export const DEFAULT_CONFIG_PATH = new URL(
  './node_modules/@comapeo/default-categories/dist/comapeo-default-categories.comapeocat',
  import.meta.url,
).pathname

/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

// Do not touch these!
const DB_DIR_NAME = 'sqlite-dbs'
const CORE_STORAGE_DIR_NAME = 'core-storage'
const CUSTOM_MAPS_DIR_NAME = 'maps'
const DEFAULT_CUSTOM_MAP_FILE_NAME = 'default.smp'

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZGlnaWRlbSIsImEiOiJjbHRyaGh3cm0wN3l4Mmpsam95NDI3c2xiIn0.daq2iZFZXQ08BD0VZWAGUw'
const DEFAULT_ONLINE_MAP_STYLE_URL = `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11?access_token=${MAPBOX_ACCESS_TOKEN}`

const log = debug('mapeo:app')

// Set these up as soon as possible (e.g. before the init function)
const serverStatus = new ServerStatus()

// Node can only start once per app process, so when the user hits Skip or
// comes back after freeing up space, we just re-run init() again ourselves
// instead of restarting the whole app.
rnBridge.channel.on('server:restart', (message) => {
  const { rootKey, forceSkipMigrate, availableDiskSpace } =
    /** @type {{ rootKey: string, forceSkipMigrate: boolean, availableDiskSpace: number }} */ (
      message
    )

  init({
    rootKey: Buffer.from(rootKey, 'hex'),
    forceSkipMigrate,
    availableDiskSpace,
    migrationsFolderPath: MIGRATIONS_FOLDER_PATH,
    oldMigrationsFolderPath: OLD_MIGRATIONS_FOLDER_PATH,
    defaultConfigPath: DEFAULT_CONFIG_PATH,
  }).catch((reason) => {
    serverStatus.setState('ERROR', {
      error: asError(reason),
      context: 'serverRestart',
    })
  })
})

/** @param {unknown} reason */
function asError(reason) {
  if (reason instanceof Error) return reason
  return new Error(typeof reason === 'string' ? reason : 'unknown rejection')
}

process.on('uncaughtException', (error) => {
  log('uncaught exception')
  serverStatus.setState('ERROR', { error, context: 'uncaughtException' })
})
process.on('unhandledRejection', (reason) => {
  log('unhandled rejection')
  serverStatus.setState('ERROR', {
    error: asError(reason),
    context: 'unhandledRejection',
  })
})
process.on('exit', (code) => {
  log(`App process exited with code ${code}`)
  const error = new Error(`App process exited with code ${code}`)
  serverStatus.setState('ERROR', { error, context: 'processExit' })
})

/**
 * @param {Object} options
 * @param {string} [options.version] Device Version
 * @param {Buffer} options.rootKey
 * @param {string} options.migrationsFolderPath
 * @param {string} options.oldMigrationsFolderPath Used as a fallback
 * @param {number} options.availableDiskSpace How much space is left on the phone in case we want to migrate to new hypercore version
 * @param {string} options.defaultConfigPath
 * @param {boolean} options.forceSkipMigrate
 */
export async function init(options) {
  const {
    version,
    rootKey,
    migrationsFolderPath,
    defaultConfigPath,
    oldMigrationsFolderPath,
    availableDiskSpace,
    forceSkipMigrate,
  } = options
  log('Starting app...')
  log(`Device version is ${version}`)

  const privateStorageDir = rnBridge.app.datadir()
  const dbDir = join(privateStorageDir, DB_DIR_NAME)
  const indexDir = join(privateStorageDir, CORE_STORAGE_DIR_NAME)
  const customMapsDir = join(privateStorageDir, CUSTOM_MAPS_DIR_NAME)

  mkdirSync(dbDir, { recursive: true })
  mkdirSync(indexDir, { recursive: true })
  mkdirSync(customMapsDir, { recursive: true })

  let useFallback = false

  if (!forceSkipMigrate) {
    const {
      shouldUpgrade,
      useFallback: useFallbackResult,
      reason,
      spaceNeeded,
    } = await checkShouldMigrate(indexDir, availableDiskSpace)
    useFallback = useFallbackResult

    if (shouldUpgrade) {
      serverStatus.setState('MIGRATING', { context: '' })
      try {
        const migrationResults = await migrateStorage(
          indexDir,
          (doneSoFar, totalCores) => {
            serverStatus.setState('MIGRATING', {
              context: `${doneSoFar}/${totalCores}`,
            })
          },
        )
        const failedMigration = Object.values(migrationResults).find(
          ({ migrated }) => !migrated,
        )
        if (failedMigration) {
          throw failedMigration.error || new Error('Storage migration failed')
        }
        serverStatus.setState('STARTING')
      } catch (reason) {
        serverStatus.setState('MIGRATION_ERROR', { error: asError(reason) })
        return
      }
    } else {
      if (reason === MIGRATION_REASON_NO_SPACE) {
        serverStatus.setState('LOW_SPACE', { context: String(spaceNeeded) })
        return
      }
    }
  }

  const fastify = Fastify()

  const ManagerClass =
    useFallback || forceSkipMigrate ? FallbackMapeoManager : MapeoManager
  const migrationPath =
    useFallback || forceSkipMigrate
      ? oldMigrationsFolderPath
      : migrationsFolderPath

  /** @type {InstanceType<typeof MapeoManager> | InstanceType<typeof FallbackMapeoManager>} */
  let manager
  try {
    manager = new ManagerClass({
      rootKey,
      dbFolder: dbDir,
      coreStorage: indexDir,
      clientMigrationsFolder: join(migrationPath, 'client'),
      projectMigrationsFolder: join(migrationPath, 'project'),
      fastify,
      defaultConfigPath,
      defaultIsArchiveDevice: true,
      defaultOnlineStyleUrl: DEFAULT_ONLINE_MAP_STYLE_URL,
      customMapPath: join(customMapsDir, DEFAULT_CUSTOM_MAP_FILE_NAME),
    })
  } catch (reason) {
    // This can still fail on its own (it runs its own DB migrations), even
    // when the storage migration above went fine. Same error screen either way.
    serverStatus.setState('MIGRATION_ERROR', { error: asError(reason) })
    return
  }

  const { publicKey, secretKey } = new KeyManager(rootKey).getIdentityKeypair()
  const mapServer = createMapServer({
    defaultOnlineStyleUrl: DEFAULT_ONLINE_MAP_STYLE_URL,
    fallbackMapPath: DEFAULT_FALLBACK_MAP_FILE_PATH,
    customMapPath: join(customMapsDir, DEFAULT_CUSTOM_MAP_FILE_NAME),
    keyPair: {
      publicKey: new Uint8Array(publicKey),
      secretKey: new Uint8Array(secretKey),
    },
  })

  // Don't await, methods that use the server will await this internally
  // Server is listening on loopback only, so will not be accessible from other devices on the network
  fastify.listen({ host: '127.0.0.1', port: 0 }).catch((error) => {
    Sentry.captureException(error)
  })

  rnBridge.app.on('pause', async (pauseLock) => {
    log('App went into background')
    manager.onBackgrounded()
    pauseLock.release()
  })

  rnBridge.app.on('resume', () => {
    log('App went into foreground')
    manager.onForegrounded()
  })

  const messagePort = new MessagePortLike()
  // @ts-expect-error Older manager is missing some fields
  createMapeoServer(manager, messagePort, {
    onRequestHook: (request, next) => {
      const sentryTrace = request.metadata?.['sentry-trace']
      const baggage = request.metadata?.baggage
      Sentry.continueTrace(
        {
          sentryTrace,
          baggage,
        },
        () => {
          Sentry.startSpan(
            {
              op: 'rpc',
              name: request.method.join('.'),
              forceTransaction: true,
              attributes: {
                'rpc.method': request.method.join('.'),
                'rpc.args': JSON.stringify(request.args),
              },
            },
            async (span) => {
              try {
                await next(request)
                span.setStatus({ code: 1, message: 'ok' })
              } catch (error) {
                span.setStatus({ code: 2, message: 'internal_error' })
                Sentry.captureException(error)
              }
            },
          )
        },
      )
    },
  })
  createAppRpcServer({ mapServer }, messagePort)
  messagePort.start()
  serverStatus.setState('STARTED')

  log('App started!')
}
