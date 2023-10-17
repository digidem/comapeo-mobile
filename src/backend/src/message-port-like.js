import {TypedEmitter} from 'tiny-typed-emitter';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const rnBridge = require('rn-bridge');

/**
 * @typedef {Object} MessagePortEvents
 * @property {(value: any) => void} message
 */

/** @typedef {import('rn-bridge').Channel} Channel */

/**
 * Wrap the nodejs-mobile RNBridge to act like a MessagePort. Queues messages
 * until `start()` is called.
 * @extends {TypedEmitter<MessagePortEvents>}
 */
class MessagePortLike extends TypedEmitter {
  /** @type {any[]} */
  #queuedMessages = [];
  /** @type {'idle' | 'started' | 'closed'} */
  #state = 'idle';
  /** @type {(message: any) => void} */
  #messageHandler;
  /** @type {String} */
  #API_EVENT_NAME = '@@API_MESSAGE';

  constructor() {
    super();
    this.#messageHandler = message => {
      if (this.#state === 'idle') {
        this.#queuedMessages.push(message);
      } else if (this.#state === 'started') {
        this.emit('message', message);
      } else {
        // no-op if the port is closed
        // (the event listener should be removed anyway)
      }
    };
    rnBridge.channel.addListener(this.#API_EVENT_NAME, this.#messageHandler);
  }

  start() {
    if (this.#state !== 'idle') {
      return;
    }
    this.#state = 'started';

    /** @type {{id: string, message: any} | undefined} */
    let event;
    while ((event = this.#queuedMessages.shift())) {
      this.#messageHandler(event);
    }
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    rnBridge.channel.removeListener(this.#API_EVENT_NAME, this.#messageHandler);
    this.#state = 'closed';
    this.#queuedMessages = [];
  }

  /**
   * @param {any} message
   * @returns {void}
   */
  postMessage(message) {
    rnBridge.channel.post(this.#API_EVENT_NAME, message);
  }

  /**
   * @param {keyof MessagePortEvents} event
   * @param {any} listener
   */
  addEventListener(event, listener) {
    this.addListener(event, listener);
  }

  /**
   * @param {keyof MessagePortEvents} event
   * @param {any} listener
   */
  removeEventListener(event, listener) {
    this.removeEventListener(event, listener);
  }
}

export default MessagePortLike;
