import debug from 'debug'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { createRequire } from 'module'
import { MapeoManager } from '@comapeo/core'
import { createMapeoServer } from '@comapeo/ipc/server.js'
import Fastify from 'fastify'
import * as Sentry from '@sentry/node'

import MessagePortLike from './message-port-like.js'
import { ServerStatus } from './status.js'

const require = createRequire(import.meta.url)

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

process.on('uncaughtException', (error) => {
  log('uncaught exception')
  serverStatus.setState('ERROR', { error, context: 'uncaughtException' })
})
process.on('unhandledRejection', (reason) => {
  log('unhandled rejection')
  let error
  if (reason instanceof Error) {
    error = reason
  } else {
    error = new Error(typeof reason === 'string' ? reason : 'unknown rejection')
  }
  serverStatus.setState('ERROR', { error, context: 'unhandledRejection' })
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
 * @param {string} options.defaultConfigPath
 */
export async function init({
  version,
  rootKey,
  migrationsFolderPath,
  defaultConfigPath,
}) {
  log('Starting app...')
  log(`Device version is ${version}`)

  const privateStorageDir = rnBridge.app.datadir()
  const dbDir = join(privateStorageDir, DB_DIR_NAME)
  const indexDir = join(privateStorageDir, CORE_STORAGE_DIR_NAME)
  const customMapsDir = join(privateStorageDir, CUSTOM_MAPS_DIR_NAME)

  mkdirSync(dbDir, { recursive: true })
  mkdirSync(indexDir, { recursive: true })
  mkdirSync(customMapsDir, { recursive: true })

  const fastify = Fastify()

  const manager = new MapeoManager({
    rootKey,
    dbFolder: dbDir,
    coreStorage: indexDir,
    clientMigrationsFolder: join(migrationsFolderPath, 'client'),
    projectMigrationsFolder: join(migrationsFolderPath, 'project'),
    fastify,
    defaultConfigPath,
    defaultIsArchiveDevice: false,
    defaultOnlineStyleUrl: DEFAULT_ONLINE_MAP_STYLE_URL,
    customMapPath: join(customMapsDir, DEFAULT_CUSTOM_MAP_FILE_NAME),
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
  messagePort.start()
  serverStatus.setState('STARTED')

  log('App started!')
}
