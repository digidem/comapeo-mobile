import EventEmitter from 'events'

declare module 'rn-bridge' {
  export interface Channel extends EventEmitter {
    on(event: string, callback: (message: unknown) => void): void
    post(event: string, message: unknown): void
    send(message: unknown): void
  }
  export interface App {
    on(
      event: 'pause',
      callback: (pauseLock: { release: () => void }) => void,
    ): void
    on(event: 'resume', callback: () => void): void
    datadir(): string
  }
  interface RNBridge {
    channel: Channel
    app: App
  }
  const rnBridge: RNBridge
  export = rnBridge
}
