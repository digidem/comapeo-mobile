import debug from 'debug'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')
import { MapeoManager } from '@mapeo/core'
import { KeyManager } from '@mapeo/crypto'
import RAM from 'random-access-memory'

import MessagePortLike from './message-port-like.js'
import { createMapeoServer } from '@mapeo/ipc'
import { ServerStatus } from './status.js'

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
 * @param {string} options.rootKey
 */
export async function init({ version, rootKey }) {
  // TODO: Account for args passed from node.startWithArgs
  debug.enable('*')

  log('Starting app...')
  log(`Device version is ${version}`)

  // 1. Initialize Mapeo
  const manager = new MapeoManager({
    rootKey: Buffer.from(rootKey, 'hex'),
    // TODO: Use actual file storage instead of memory
    dbFolder: ':memory:',
    coreStorage: () => new RAM(),
  })

  const messagePort = new MessagePortLike()
  createMapeoServer(manager, messagePort)
  messagePort.start()
  serverStatus.setState('STARTED')

  log('App started!')
}
