import { debug } from 'debug'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const log = debug('mapeo:status')

/**
 * @typedef {'STARTING' | 'STARTED' | 'ERROR'} Status
 */
/**
 * @typedef {{ value: Status, error?: string, context?: string }} StatusMessage
 */

export class ServerStatus {
  /** @type {Status} */
  #state = 'STARTING'

  constructor() {
    rnBridge.channel.on('get-server-status', () => {
      log('status request -> ' + this.state)
      rnBridge.channel.post(
        'server:status',
        /** @type {StatusMessage} */
        { value: this.state },
      )
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
    if (nextState === this.state) return
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
}
