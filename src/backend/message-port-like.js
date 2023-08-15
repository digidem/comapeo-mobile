import {TypedEmitter} from 'tiny-typed-emitter';
import rn_bridge from 'rn-bridge';

/**
 * @typedef {Object} MessagePortEvents
 * @property {(value: any) => void} message
 */

/** @typedef {import('nodejs-mobile-react-native').Channel} Channel */

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
    rn_bridge.channel.addListener(this.#API_EVENT_NAME, this.#messageHandler);
  }

  start() {
    if (this.#state !== 'idle') {
      return;
    }
    this.#state = 'started';
    for (const msg of this.#queuedMessages) {
      this.emit('message', msg);
    }
    this.#queuedMessages = [];
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    rn_bridge.channel.removeListener(
      this.#API_EVENT_NAME,
      this.#messageHandler,
    );
    this.#state = 'closed';
    this.#queuedMessages = [];
  }

  /**
   * @param {any} message
   * @returns {void}
   */
  postMessage(message) {
    rn_bridge.channel.post(this.#API_EVENT_NAME, message);
  }
}

export default MessagePortLike;
