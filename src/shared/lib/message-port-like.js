import {TypedEmitter} from 'tiny-typed-emitter';

/**
 * @typedef {Object} MessagePortEvents
 * @property {(value: any) => void} message
 */

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
  /** @type {Channel} */
  #channel;

  /**
   * @param {Channel} channel
   */
  constructor(channel) {
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
    this.#channel = channel;
    const method = 'on' in channel ? 'on' : 'addListener';
    channel[method](this.#API_EVENT_NAME, this.#messageHandler)
    this.start();
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
    const method = 'off' in this.channel ? 'off' : 'removeListener';
    this.#channel[method](this.#API_EVENT_NAME, this.#messageHandler);
    this.#state = 'closed';
    this.#queuedMessages = [];
  }

  /**
   * @param {any} message
   * @returns {void}
   */
  postMessage(message) {
    this.#channel.post(this.#API_EVENT_NAME, message);
  }
}

export default MessagePortLike;
