import debug from 'debug'
import { createRequire } from 'module'
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = createRequire(import.meta.url)('rn-bridge')
import { MapeoManager } from '@mapeo/core'
import { KeyManager } from '@mapeo/crypto'
import RAM from 'random-access-memory'

import { Server } from './server.js'

const log = debug('mapeo:app')

/**
 * @param {Object} [options]
 * @param {string} [options.version] Device Version
 */
export async function init({ version } = {}) {
  // TODO: Account for args passed from node.startWithArgs
  debug.enable('*')

  log('Starting app...')
  log(`Device version is ${version}`)

  // TODO: Persisted and read from local file
  /** @type {{ activeProjectId: string | null }} */
  const state = {
    activeProjectId: null,
  }

  // 1. Initialize Mapeo
  const manager = new MapeoManager({
    rootKey: KeyManager.generateRootKey(),
    // TODO: Use actual file storage instead of memory
    dbFolder: ':memory:',
    coreStorage: () => new RAM(),
  })

  // Automatically create initial project if no projects exist yet
  if ((await manager.listProjects()).length === 0) {
    const projectId = await manager.createProject()
    log(`Created initial project with id ${projectId}`)
    state.activeProjectId = projectId
  }

  const server = new Server(manager)

  // 2. Set up event listeners
  rnBridge.channel.on('update-active-project-id', (id) => {
    // TODO: Write to persisted file
    state.activeProjectId = id
  })

  rnBridge.channel.on('get-active-project-id', async () => {
    // TODO: Read from persisted file
    rnBridge.channel.post('app:active-project-id', state.activeProjectId)
  })

  rnBridge.app.on('resume', () => {
    log('App went into foreground')
    // When the RN app requests permissions from the user it causes a resume event
    // but no pause event. We don't need to start the server if it's already
    // listening (because it wasn't paused)
    // https://github.com/janeasystems/nodejs-mobile/issues/177
    server.start()
  })

  rnBridge.app.on('pause', (pauseLock) => {
    log('App went into background')
    server.stop()
    pauseLock.release()
  })

  process.on('exit', (code) => {
    log(`App process exited with code ${code}`)
    server.stop()
  })

  // 3. Start server
  server.start()

  log('App started!')
}
