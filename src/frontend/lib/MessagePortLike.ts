import {EventSubscription} from 'react-native';
import EventEmitter from 'eventemitter3';
import nodejs from 'nodejs-mobile-react-native';
import type {ServerStateStore, ServerState} from './ServerStateStore.ts';
import {ExhaustivenessError} from './ExhaustivenessError.ts';

type MessagePortState = 'idle' | 'started' | 'closed';

export class MessagePortLike extends EventEmitter {
  #API_EVENT_NAME = '@@API_MESSAGE';
  #channelSubscription: EventSubscription;
  #unsubscribeServerState: () => void;
  #state: MessagePortState = 'idle';
  #incomingQueue: unknown[] = [];
  #outgoingQueue: unknown[] = [];
  #handleChannelMessage;

  #handleServerStateChange = (serverState: ServerState) => {
    if (serverState.value === 'STARTED') {
      let message;
      while ((message = this.#outgoingQueue.shift())) {
        this.postMessage(message);
      }
    }
  };
  #serverStateStore: ServerStateStore;

  constructor({serverStateStore}: {serverStateStore: ServerStateStore}) {
    super();

    this.#serverStateStore = serverStateStore;
    this.#unsubscribeServerState = serverStateStore.subscribe(
      this.#handleServerStateChange,
    );

    this.#handleChannelMessage = (message: unknown) => {
      if (this.#state === 'idle') {
        this.#incomingQueue.push(message);
      } else if (this.#state === 'started') {
        this.emit('message', message);
      } else {
        // no-op if the port is closed
        // (the event listener should be removed anyway)
      }
    };

    // @ts-expect-error Typings from nodejs-mobile-react-native are incorrect
    this.#channelSubscription = nodejs.channel.addListener(
      this.#API_EVENT_NAME,
      this.#handleChannelMessage,
    );
  }

  postMessage(message: unknown) {
    const serverState = this.#serverStateStore.getState();
    switch (serverState.value) {
      case 'STARTING':
        this.#outgoingQueue.push(message);
        break;
      case 'STARTED':
        nodejs.channel.post(this.#API_EVENT_NAME, message);
        break;
      case 'ERROR':
        throw new Error(serverState.error || 'Unknown server error');
      default:
        throw new ExhaustivenessError(serverState.value);
    }
  }

  /**
   * Start receiving messages from the channel. Messages received before calling
   * `start` are queued and processed once `start` is called.
   */
  start() {
    if (this.#state !== 'idle') {
      return;
    }
    this.#state = 'started';

    let message;

    while ((message = this.#incomingQueue.shift())) {
      this.#handleChannelMessage(message);
    }
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    this.#state = 'closed';
    this.#incomingQueue = [];

    this.#channelSubscription.remove();
    this.#unsubscribeServerState();
  }

  addEventListener(event: string, listener: (msg: unknown) => void) {
    this.addListener(event, listener);
  }

  removeEventListener(event: string, listener: (msg: unknown) => void) {
    this.removeListener(event, listener);
  }
}
