import {throwIfAborted} from './throwIfAborted';

describe('throwIfAborted', () => {
  it('is a no-op if not aborted', () => {
    expect(() => throwIfAborted({aborted: false})).not.toThrow();
  });

  it('throws if aborted', () => {
    expect(() => throwIfAborted({aborted: true})).toThrow(
      'The operation was aborted',
    );
    expect(() =>
      throwIfAborted({aborted: true, reason: new Error('foo bar')}),
    ).toThrow('foo bar');
  });
});
