import { MapeoManager } from '@mapeo/core'
import { createMapeoServer } from '@mapeo/ipc'
import debug from 'debug'

import MessagePortLike from './message-port-like.js'
import { STATUSES, ServerStatus } from './status.js'

const log = debug('mapeo:server')

export class Server {
  #channel
  #mapeoManager
  #status
  /** @type {{ close: () => void } | null} */
  #apiServer = null

  /**
   * @param {MapeoManager} mapeoManager
   */
  constructor(mapeoManager) {
    this.#channel = new MessagePortLike()
    this.#mapeoManager = mapeoManager
    this.#status = new ServerStatus()
  }

  start() {
    if (this.#status.state === STATUSES.LISTENING) return

    log('Starting server')

    this.#apiServer = createMapeoServer(this.#mapeoManager, this.#channel)
    this.#channel.start()
    this.#status.startHeartbeat()
    this.#status.setState(STATUSES.LISTENING)
  }

  stop() {
    if (this.#status.state === STATUSES.CLOSED) return

    log('Stopping server')

    this.#apiServer?.close()
    this.#channel.close()
    this.#status.pauseHeartbeat()
    this.#status.setState(STATUSES.CLOSED)
  }
}
