import {
  JOIN_FAILURE_CODES,
  getJoinFailureCopy,
  getJoinRequestErrorCode,
  toJoinFailureCode,
} from './joinFailure';

describe('getJoinRequestErrorCode', () => {
  // The shape core actually delivers: an event payload, so the prototype is
  // gone and `instanceof Error` is false.
  it('reads the code off an error that crossed ipc as a plain object', () => {
    expect(
      getJoinRequestErrorCode({
        code: 'INVITE_DENIED_BY_INVITER_ERROR',
        name: 'InviteDeniedByInviterError',
        status: 403,
      }),
    ).toBe('INVITE_DENIED_BY_INVITER_ERROR');
  });

  it('reads the code off a real Error', () => {
    expect(
      getJoinRequestErrorCode(
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
    expect(getJoinRequestErrorCode(error)).toBeUndefined();
  });
});

describe('toJoinFailureCode', () => {
  it.each(JOIN_FAILURE_CODES)('passes through %s', code => {
    expect(toJoinFailureCode(code)).toBe(code);
  });

  it.each([
    ['undefined', undefined],
    ['an empty string', ''],
    ['an unrecognised code', 'SOME_NEW_CORE_ERROR'],
  ])('maps %s to UNKNOWN', (_label, code) => {
    expect(toJoinFailureCode(code)).toBe('UNKNOWN');
  });
});

describe('getJoinFailureCopy', () => {
  it.each([...JOIN_FAILURE_CODES, 'UNKNOWN' as const])(
    'returns a title and an icon for %s',
    code => {
      const copy = getJoinFailureCopy(toJoinFailureCode(code));
      expect(copy.title.defaultMessage).toBeTruthy();
      expect(copy.icon.name).toBeTruthy();
    },
  );

  it.each([
    ['INVITE_DENIED_BY_INVITER_ERROR', 'send'],
    ['JOIN_PROJECT_CANCELLED_ERROR', 'send'],
    ['UNKNOWN_INVITE_ID_ERROR', 'link'],
    ['INVITE_CONNECTION_ERROR', 'wifi'],
    ['INVITE_REDEEM_CONNECTION_CLOSED_ERROR', 'wifi'],
  ] as const)('uses the %s icon the designs call for', (code, iconName) => {
    expect(getJoinFailureCopy(code).icon.name).toBe(iconName);
  });

  it('distinguishes never-connected from connection-dropped', () => {
    expect(
      getJoinFailureCopy('INVITE_CONNECTION_ERROR').title.defaultMessage,
    ).toBe('Failed to connect.');
    expect(
      getJoinFailureCopy('INVITE_REDEEM_CONNECTION_CLOSED_ERROR').title
        .defaultMessage,
    ).toBe('Connection Lost');
  });

  it('tells the invitee how to get a new link when denied or expired', () => {
    for (const code of [
      'INVITE_DENIED_BY_INVITER_ERROR',
      'UNKNOWN_INVITE_ID_ERROR',
    ] as const) {
      expect(getJoinFailureCopy(code).description?.defaultMessage).toBe(
        'Coordinate with team for a new Invite Link',
      );
    }
  });

  it('does not offer a new link for a cancellation the invitee made', () => {
    expect(getJoinFailureCopy('JOIN_PROJECT_CANCELLED_ERROR').description).toBe(
      undefined,
    );
  });
});
