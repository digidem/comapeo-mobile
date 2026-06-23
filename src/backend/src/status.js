import { debug } from 'debug'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const log = debug('mapeo:status')

/**
 * @typedef {'CHECKING' | 'STARTING' | 'STARTED' | 'ERROR' | 'MIGRATING' | 'MIGRATION_ERROR' | 'LOW_SPACE'} Status
 */

/*
  CHECKING ──► STARTING ──► STARTED
     │             │
     │             └──► ERROR
     │
     ├──► LOW_SPACE ──────────────────┐
     │                                ▼
     └──► MIGRATING ─────────────► STARTING
              │
              └──► MIGRATION_ERROR
*/

/**
 * @typedef {{ value: Status, error?: string, context?: string }} StatusMessage
 */

export class ServerStatus {
  /** @type {Status} */
  #state = 'STARTING'

  constructor() {
    rnBridge.channel.on('get-server-status', async () => {
      log('status request -> ' + this.state)
      this.#postState()
    })
    // Sometimes rnBridge.channel.post doesn't work if the app is in the
    // background, so when we resume we re-send the state to the front-end. This
    // fixes a bug with hot reloading in React Native where the server state
    // would not be sent after fast refresh.
    rnBridge.app.on('resume', () => {
      this.#postState()
    })
  }

  get state() {
    return this.#state
  }
  /**
   *
   * @param {Status} nextState
   * @param {Object} [opts]
   * @param {Error} [opts.error]
   * @param {string} [opts.context]
   *
   * @returns
   */
  setState(nextState, { error, context } = {}) {
    // Allow updating the MIGRATING state with progress
    if (nextState === this.state && nextState !== 'MIGRATING') return
    log('state changed', nextState)

    // Once we have an uncaught error, don't try to pretend it's gone away
    if (this.state === 'ERROR') return

    if (nextState === 'ERROR') {
      error = error || new Error('Unknown server error')
      log(context, error.message)
      // TODO: Log to Bugsnag
    }

    this.#state = nextState

    rnBridge.channel.post(
      'server:status',
      /** @type {StatusMessage} */
      {
        value: nextState,
        error: error && error.message,
        context,
      },
    )
  }

  #postState() {
    log('posting state --> ' + this.state)
    rnBridge.channel.post(
      'server:status',
      /** @type {StatusMessage} */
      { value: this.state },
    )
  }
}
