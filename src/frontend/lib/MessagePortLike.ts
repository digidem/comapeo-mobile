import {EventSubscription} from 'react-native';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter.js';
import {Channel} from 'nodejs-mobile-react-native';

type Listener = (...args: any[]) => void;

export type ServerState = 'idle' | 'started' | 'closed';

export class MessagePortLike extends EventEmitter {
  #API_EVENT_NAME = '@@API_MESSAGE';
  #channel: Channel;
  #eventsSubscriptions = new Map<
    string,
    WeakMap<Listener, EventSubscription>
  >();
  #channelSubscription: EventSubscription;
  #state: ServerState = 'idle';
  #queuedMessages: any[] = [];

  constructor(channel: Channel) {
    super();
    this.#channel = channel;

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
    this.#channelSubscription = channel.addListener(
      this.#API_EVENT_NAME,
      handleChannelMessage,
    );

    channel.addListener('message', ({value}) => {
      if (value === 'started') {
        console.log('server started');
      }
    });
    this.start();
  }

  postMessage(message: any) {
    this.#channel.post(this.#API_EVENT_NAME, message);
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

  on(event: string, listener: (...args: any[]) => any) {
    const sub = this.addListener(event, listener);

    const registry = this.#eventsSubscriptions.get(event);

    if (!registry) {
      this.#eventsSubscriptions.set(event, new WeakMap([[listener, sub]]));
      return this;
    }

    if (!registry.has(listener)) {
      registry.set(listener, sub);
    }

    return this;
  }

  off(event: string, listener: (...args: any[]) => void) {
    return this.removeListener(event, listener);
  }

  removeListener(event: string, listener: (...args: any[]) => void) {
    const registry = this.#eventsSubscriptions.get(event);

    if (!registry) {
      return;
    }

    const subscription = registry.get(listener);

    if (subscription) {
      subscription.remove();
      registry.delete(listener);

      // TODO: Call this.#subscriptions.delete(event) if no more listeners?
    }

    return this;
  }

  removeAllListeners() {
    this.#eventsSubscriptions.clear();
    this.removeAllListeners();
  }

  close() {
    if (this.#state === 'closed') {
      return;
    }

    this.#state = 'closed';
    this.#queuedMessages = [];

    this.#eventsSubscriptions.clear();
    this.#channelSubscription.remove();
  }
}
