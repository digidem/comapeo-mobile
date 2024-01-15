import { promisify } from 'util'
import { once } from 'events'
import pTimeout from 'p-timeout'
import Fastify from 'fastify'
import StateMachine from 'start-stop-state-machine'

import { StaticStylesPlugin } from './static-styles-plugin.js'

export class MapServer {
  #fastify
  #serverState
  #fastifyStarted
  #host
  #port

  /**
   * @param {object} mapOpts
   * @param {string} mapOpts.staticStylesDir
   * @param {import('fastify').FastifyServerOptions} [fastifyOpts]
   */
  constructor({ staticStylesDir }, fastifyOpts) {
    this.#fastifyStarted = false
    this.#host = '127.0.0.1'
    this.#port = 0

    this.#fastify = Fastify(fastifyOpts)

    this.#fastify.register(StaticStylesPlugin, {
      // Prefix not strictly needed since this is a standalone server instance (i.e. no route naming conflicts)
      // prefix: '/styles',
      staticStylesDir,
    })

    this.#serverState = new StateMachine({
      start: this.#start.bind(this),
      stop: this.#stop.bind(this),
    })
  }

  /**
   * @param {object} opts
   * @param {string} [opts.host]
   * @param {number} [opts.port]
   */
  async #start({ host = '127.0.0.1', port = 0 } = {}) {
    this.#host = host
    this.#port = port

    if (!this.#fastifyStarted) {
      await this.#fastify.listen({ host: this.#host, port: this.#port })
      this.#fastifyStarted = true
      return
    }

    const { server } = this.#fastify

    await new Promise((res, rej) => {
      server.listen.call(server, { port: this.#port, host: this.#host })

      server.once('listening', onListening)
      server.once('error', onError)

      function onListening() {
        server.removeListener('error', onError)
        res(null)
      }

      /**
       * @param {Error} err
       */
      function onError(err) {
        server.removeListener('listening', onListening)
        rej(err)
      }
    })
  }

  async #stop() {
    const { server } = this.#fastify
    await promisify(server.close.bind(server))()
  }

  /**
   * @param {object} [opts]
   * @param {string} [opts.host]
   * @param {number} [opts.port]
   */
  async start(opts) {
    await this.#serverState.start(opts)
  }

  async started() {
    return this.#serverState.started()
  }

  async stop() {
    await this.#serverState.stop()
  }

  /**
   * @returns {Promise<string>}
   */
  async getAddress() {
    return pTimeout(getServerAddress(this.#fastify.server), {
      milliseconds: 1000,
    })
  }
}

/**
 * @param {import('node:http').Server} server
 *
 * @returns {Promise<string>}
 */
async function getServerAddress(server) {
  const address = server.address()

  if (!address) {
    await once(server, 'listening')
    return getServerAddress(server)
  }

  if (typeof address === 'string') {
    return address
  }

  // Full address construction for non unix-socket address
  // https://github.com/fastify/fastify/blob/7aa802ed224b91ca559edec469a6b903e89a7f88/lib/server.js#L413
  let addr = ''
  if (address.address.indexOf(':') === -1) {
    addr += address.address + ':' + address.port
  } else {
    addr += '[' + address.address + ']:' + address.port
  }

  return 'http://' + addr
}
