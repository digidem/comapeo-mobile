import { debug } from 'debug'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const rnBridge = require('rn-bridge')

const log = debug('mapeo:status')

/**
 * @typedef {{ status: 'starting' } | { status: 'ready' } | { status: 'error', error: Error, context: string }} State
 *
 * @typedef {{ status: 'starting' } | { status: 'ready' } | { status: 'error', error: string, context: string }} StatusMessage
 */

export class ServerStatus {
  /** @type {State} */
  #state = { status: 'starting' }

  constructor() {
    rnBridge.channel.on('get-server-status', async () => {
      log('status request -> ' + this.#state)
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

  /**
   * @param {State} nextState
   */
  setState(nextState) {
    if (nextState.status === this.#state.status) return
    log('state changed', nextState)

    // Once we have an uncaught error, don't try to pretend it's gone away
    if (this.#state.status === 'error') return

    if (nextState.status === 'error') {
      log(nextState.context, nextState.error)
    }

    this.#state = nextState

    this.#postState()
  }

  #postState() {
    log('posting state --> ' + this.#state)

    /** @type {StatusMessage} */
    let message

    if (this.#state.status === 'error') {
      message = {
        status: this.#state.status,
        error: this.#state.error.message,
        context: this.#state.context,
      }
    } else {
      message = this.#state
    }

    rnBridge.channel.post('server:status', message)
  }
}
