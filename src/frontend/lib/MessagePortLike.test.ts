import {MessagePortLike} from './MessagePortLike';
import type {ServerStateStore, ServerState} from './ServerStateStore';

const mockPost = jest.fn();
jest.mock('@comapeo/nodejs-mobile-react-native', () => ({
  __esModule: true,
  default: {
    channel: {
      addListener: jest.fn(() => ({remove: jest.fn()})),
      post: (...args: unknown[]) => mockPost(...args),
    },
  },
}));

function makeStore(state: ServerState): ServerStateStore {
  return {
    getState: () => state,
    subscribe: jest.fn(() => jest.fn()),
  } as unknown as ServerStateStore;
}

describe('MessagePortLike.postMessage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not throw when the backend is in ERROR state (no crash storm)', () => {
    const port = new MessagePortLike({
      serverStateStore: makeStore({
        value: 'ERROR',
        error: 'Cannot add core after closing',
      }),
    });
    expect(() => port.postMessage({foo: 'bar'})).not.toThrow();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('posts immediately when STARTED', () => {
    const port = new MessagePortLike({
      serverStateStore: makeStore({value: 'STARTED'}),
    });
    port.postMessage({foo: 'bar'});
    expect(mockPost).toHaveBeenCalledWith('@@API_MESSAGE', {foo: 'bar'});
  });

  it('queues (does not throw, does not post) when STARTING', () => {
    const port = new MessagePortLike({
      serverStateStore: makeStore({value: 'STARTING'}),
    });
    expect(() => port.postMessage({foo: 'bar'})).not.toThrow();
    expect(mockPost).not.toHaveBeenCalled();
  });
});
