import debug from 'debug'
import { join } from 'path'
import { mkdirSync } from 'fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')
import { MapeoManager } from '@mapeo/core'
import { createMapeoServer } from '@mapeo/ipc'

import MessagePortLike from './message-port-like.js'
import { ServerStatus } from './status.js'

// Do not touch these!
const DB_DIR_NAME = 'sqlite-dbs'
const CORE_STORAGE_DIR_NAME = 'core-storage'

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
 * @param {string} options.sharedStoragePath Path to app-specific external file storage folder
 *
 */
export async function init({
  version,
  rootKey,
  migrationsFolderPath,
  sharedStoragePath,
}) {
  log('Starting app...')
  log(`Device version is ${version}`)

  const privateStorageDir = rnBridge.app.datadir()
  const dbDir = join(privateStorageDir, DB_DIR_NAME)
  const indexDir = join(privateStorageDir, CORE_STORAGE_DIR_NAME)

  mkdirSync(dbDir, { recursive: true })
  mkdirSync(indexDir, { recursive: true })

  const manager = new MapeoManager({
    rootKey,
    dbFolder: dbDir,
    coreStorage: indexDir,
    clientMigrationsFolder: join(migrationsFolderPath, 'client'),
    projectMigrationsFolder: join(migrationsFolderPath, 'project'),
  })

  // Don't await, methods that use the server will await this internally
  manager.startMediaServer()

  rnBridge.app.on('pause', async (pauseLock) => {
    log('App went into background')
    await manager.stopMediaServer()
    pauseLock.release()
  })

  rnBridge.app.on('resume', () => {
    log('App went into foreground')
    manager.startMediaServer()
  })

  const messagePort = new MessagePortLike()
  createMapeoServer(manager, messagePort)
  messagePort.start()
  serverStatus.setState('STARTED')

  log('App started!')
}
