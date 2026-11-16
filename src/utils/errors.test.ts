import {getEventErrorCode, toError} from './errors';

describe('getEventErrorCode', () => {
  // The shape core actually delivers on an event: the prototype is gone, so
  // `instanceof Error` is false and core's own getErrorCode reads nothing.
  it('reads the code off an error that crossed ipc as a plain object', () => {
    expect(
      getEventErrorCode({
        code: 'INVITE_DENIED_BY_INVITER_ERROR',
        name: 'InviteDeniedByInviterError',
        status: 403,
      }),
    ).toBe('INVITE_DENIED_BY_INVITER_ERROR');
  });

  it('reads the code off a real Error', () => {
    expect(
      getEventErrorCode(
        Object.assign(new Error('denied'), {
          code: 'INVITE_DENIED_BY_INVITER_ERROR',
        }),
      ),
    ).toBe('INVITE_DENIED_BY_INVITER_ERROR');
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'INVITE_DENIED_BY_INVITER_ERROR'],
    ['an object with no code', {name: 'Error'}],
    ['an object with a non-string code', {code: 403}],
  ])('returns undefined for %s', (_label, error) => {
    expect(getEventErrorCode(error)).toBeUndefined();
  });
});

describe('toError', () => {
  it('passes an Error through', () => {
    const error = new Error('real');
    expect(toError(error, 'fallback')).toBe(error);
  });

  it.each([
    ['a plain object', {code: 'SOME_ERROR'}],
    ['a string', 'not an error'],
    ['undefined', undefined],
  ])('builds an Error from the fallback message for %s', (_label, value) => {
    expect(toError(value, 'fallback')).toEqual(new Error('fallback'));
  });
});
