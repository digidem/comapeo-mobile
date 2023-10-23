import debug from 'debug'
import { createRequire } from 'module'
const rnBridge = createRequire(import.meta.url)('rn-bridge')
import { MapeoManager } from '@mapeo/core'
import { createMapeoServer } from '@mapeo/ipc'
import { KeyManager } from '@mapeo/crypto'
import RAM from 'random-access-memory'

import MessagePortLike from './message-port-like.js'

/** @typedef {Object} State
 *
 * @property {import('../types/api.js').Status} status
 */

// TODO: Account for args passed from node.startWithArgs
debug.enable('*')
const log = debug('mapeo:index')

log('Starting Node...')

/**
 * @param {Object} [options]
 * @param {string} [options.version] Device Version
 */
export async function init({ version } = {}) {
  log(`Device version is ${version}`)

  // 1. Initialize server state
  /** @type {State} */
  const state = { status: 'idle' }

  // 2. Initialize Mapeo API server
  const channel = new MessagePortLike()

  const manager = new MapeoManager({
    rootKey: KeyManager.generateRootKey(),
    dbFolder: ':memory:',
    coreStorage: () => new RAM(),
  })

  const { close } = createMapeoServer(manager, channel)

  channel.start()

  // 3. Initialize event listeners
  rnBridge.channel.on('get-status', () => {
    rnBridge.channel.post('status', state.status)
  })

  rnBridge.channel.on('close', () => {
    close()
    state.status = 'closed'
  })

  process.on('exit', () => {
    close()
    state.status = 'closed'
  })

  // 4. Send initial status message to client
  state.status = 'listening'
  rnBridge.channel.post('status', { value: state.status })

  log('Node was initialized!')
}
