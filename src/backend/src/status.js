import { debug } from 'debug'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
/** @type {import('../types/rn-bridge.js')} */
const rnBridge = require('rn-bridge')

const log = debug('mapeo:status')

/**
 * @typedef {Object} Statuses
 *
 * @property {'IDLE'} IDLE
 * @property {'STARTING'} STARTING
 * @property {'LISTENING'} LISTENING
 * @property {'CLOSING'} CLOSING
 * @property {'CLOSED'} CLOSED
 * @property {'ERROR'} ERROR
 * @property {'TIMEOUT'} TIMEOUT
 */

/**
 * @typedef {Statuses[keyof Statuses]} Status
 */

/**
 * @typedef {{ value: Status, error?: string, context?: string }} StatusMessage
 */

/**
 * @type {Statuses}
 */
export const STATUSES = {
  IDLE: 'IDLE',
  STARTING: 'STARTING',
  LISTENING: 'LISTENING',
  CLOSING: 'CLOSING',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
}

export class ServerStatus {
  /** @type {NodeJS.Timeout | undefined} */
  #intervalId = undefined
  /** @type {Status} */
  #state = 'IDLE'

  constructor() {
    rnBridge.channel.on('status', () => {
      log('status request -> ' + this.state)
      rnBridge.channel.post(
        'server:status',
        /** @type {StatusMessage} */
        { value: this.state },
      )
    })
  }

  startHeartbeat() {
    log('Start heartbeat')
    if (this.#intervalId) return // Don't have two heartbeats
    this.#intervalId = setInterval(() => {
      rnBridge.channel.post(
        'server:status',
        /** @type {StatusMessage} */
        { value: this.state },
      )
    }, 4000)
  }

  pauseHeartbeat() {
    log('Pause heartbeat')
    clearInterval(this.#intervalId)
    this.#intervalId = undefined
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

    if (nextState === STATUSES.ERROR) {
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
