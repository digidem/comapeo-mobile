import {EventSubscription} from 'react-native';
import EventEmitter from 'eventemitter3';
import nodejs from 'nodejs-mobile-react-native';

export type ServerState = 'idle' | 'started' | 'closed';

export class MessagePortLike extends EventEmitter {
  #API_EVENT_NAME = '@@API_MESSAGE';
  #channelSubscription: EventSubscription;
  #state: ServerState = 'idle';
  #queuedMessages: any[] = [];

  constructor() {
    super();

    const handleChannelMessage = (message: any) => {
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
      handleChannelMessage,
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
    for (const msg of this.#queuedMessages) {
      this.emit('message', msg);
    }
    this.#queuedMessages = [];
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    this.#state = 'closed';
    this.#queuedMessages = [];

    this.#channelSubscription.remove();
  }
}
