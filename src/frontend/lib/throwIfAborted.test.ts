import {throwIfAborted} from './throwIfAborted';

describe('throwIfAborted', () => {
  it('is a no-op if not aborted', () => {
    const {signal} = new AbortController();

    expect(() => throwIfAborted(signal)).not.toThrow();
  });

  it('throws if aborted', () => {
    const abortController = new AbortController();
    const {signal} = abortController;

    abortController.abort(new Error('uh oh'));

    expect(() => throwIfAborted(signal)).toThrow('uh oh');
  });
});
