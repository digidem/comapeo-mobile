import {EventSubscription} from 'react-native';
import EventEmitter from 'eventemitter3';
import nodejs from 'nodejs-mobile-react-native';

export type ServerState = 'idle' | 'started' | 'closed';

export class MessagePortLike extends EventEmitter {
  #API_EVENT_NAME = '@@API_MESSAGE';
  #channelSubscription: EventSubscription;
  #state: ServerState = 'idle';
  #queuedMessages: any[] = [];
  #handleChannelMessage;

  constructor() {
    super();

    this.#handleChannelMessage = (message: any) => {
      if (this.#state === 'idle') {
        this.#queuedMessages.push(message);
      } else if (this.#state === 'started') {
        this.emit('message', message);
      } else {
        // no-op if the port is closed
        // (the event listener should be removed anyway)
      }
    };

    // @ts-expect-error
    this.#channelSubscription = nodejs.channel.addListener(
      this.#API_EVENT_NAME,
      this.#handleChannelMessage,
    );
  }

  postMessage(message: any) {
    nodejs.channel.post(this.#API_EVENT_NAME, message);
  }

  start() {
    if (this.#state !== 'idle') {
      return;
    }
    this.#state = 'started';

    let message;

    while ((message = this.#queuedMessages.shift())) {
      this.#handleChannelMessage(message);
    }
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    this.#state = 'closed';
    this.#queuedMessages = [];

    this.#channelSubscription.remove();
  }

  addEventListener(event: string, listener: (msg: any) => void) {
    this.addListener(event, listener);
  }

  removeEventListener(event: string, listener: (msg: any) => void) {
    this.removeListener(event, listener);
  }
}
