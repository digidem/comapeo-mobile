import {EventSubscription} from 'react-native';
import EventEmitter from 'eventemitter3';
import nodejs from '@comapeo/nodejs-mobile-react-native';
import * as Sentry from '@sentry/react-native';
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
  #reportedErrorDrop = false;
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
      case 'CHECKING':
      case 'MIGRATING':
      case 'LOW_SPACE':
      case 'STARTING':
        this.#outgoingQueue.push(message);
        break;
      case 'STARTED':
        nodejs.channel.post(this.#API_EVENT_NAME, message);
        break;
      case 'MIGRATION_ERROR':
      case 'ERROR':
        // The backend has latched into a permanent ERROR state, already surfaced
        // to the user via ServerStateStore. Routine teardown RPC sends (e.g.
        // rpc-reflector OFF/unsubscribe during unmount) must not throw here, or a
        // single backend error becomes a storm of fatal frontend crashes. Drop
        // the send; the error UI is driven by the server-state subscription.
        // Leave one breadcrumb so dropped sends are diagnosable without
        // re-introducing an (even non-fatal) event storm — the backend already
        // captures the underlying cause.
        if (!this.#reportedErrorDrop) {
          this.#reportedErrorDrop = true;
          Sentry.addBreadcrumb({
            category: 'ipc',
            level: 'warning',
            message: `Dropping RPC send; backend is in ${serverState.value} state`,
          });
        }
        break;
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
