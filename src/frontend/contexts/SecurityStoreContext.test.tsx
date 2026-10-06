import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {deleteItemAsync, getItem} from 'expo-secure-store';

import {
  createSecurityStore,
  type SecurityStore,
  SecurityStoreProvider,
  useSecurityActions,
  useSecurityState,
} from './SecurityStoreContext';
import {DEFAULT_OBSCURE_CODE, verifyPasscode} from '../lib/security';

jest.mock('expo-secure-store', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

let mockIsFreshInstall = false;
jest.mock('../lib/freshInstall', () => ({
  get isFreshInstall() {
    return mockIsFreshInstall;
  },
}));

function createWrapper(settingsStore: SecurityStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SecurityStoreProvider value={settingsStore}>
        {children}
      </SecurityStoreProvider>
    );
  };
}

test('initial state', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = await renderHook(() => useSecurityState(), {
    wrapper,
  });

  const {passcode, obscureCodeEnabled, failedAttempts, lockUntil} =
    stateHook.result.current;

  expect({
    passcode,
    obscureCodeEnabled,
    failedAttempts,
    lockUntil,
  }).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('passcode cannot be set to invalid value', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useSecurityActions(), {
    wrapper,
  });
  const stateHook = await renderHook(() => useSecurityState(), {
    wrapper,
  });

  const invalidValues = [
    DEFAULT_OBSCURE_CODE,
    '',
    'abc',
    'abcde',
    '123',
    '123456',
    '123.4',
  ];

  for (const v of invalidValues) {
    await expect(async () => {
      await actionsHook.result.current.setPasscode(v);
    }).rejects.toThrow();
  }

  const {passcode, obscureCodeEnabled, failedAttempts, lockUntil} =
    stateHook.result.current;

  expect({
    passcode,
    obscureCodeEnabled,
    failedAttempts,
    lockUntil,
  }).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('set and verify hashed passcode', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useSecurityActions(), {wrapper});
  const stateHook = await renderHook(() => useSecurityState(), {wrapper});

  await act(async () => {
    await actionsHook.result.current.setPasscode('12345');
  });

  const stored = stateHook.result.current.passcode;
  expect(typeof stored).toBe('string');
  expect(stored).toContain(':');

  const verified = await verifyPasscode({input: '12345', stored: stored!});
  expect(verified).toBe(true);
});

test('obscure code cannot be set when passcode is not set', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useSecurityActions(), {
    wrapper,
  });

  const stateHook = await renderHook(() => useSecurityState(), {
    wrapper,
  });

  expect(() => {
    actionsHook.result.current.enableObscureCode(true);
  }).toThrow();

  const {passcode, obscureCodeEnabled, failedAttempts, lockUntil} =
    stateHook.result.current;

  expect({
    passcode,
    obscureCodeEnabled,
    failedAttempts,
    lockUntil,
  }).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('obscure code has expected value when enabled', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = await renderHook(() => useSecurityState(), {wrapper});
  const actionsHook = await renderHook(() => useSecurityActions(), {wrapper});

  await act(async () => {
    await actionsHook.result.current.setPasscode('12345');
  });

  expect(stateHook.result.current.obscureCodeEnabled).toBe(false);

  await act(async () => {
    actionsHook.result.current.enableObscureCode(true);
  });

  expect(stateHook.result.current.obscureCodeEnabled).toBe(true);
});

test('obscure code is unset when passcode is unset', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = await renderHook(() => useSecurityState(), {
    wrapper,
  });

  const actionsHook = await renderHook(() => useSecurityActions(), {
    wrapper,
  });

  await act(async () => {
    await actionsHook.result.current.setPasscode('12345');
    actionsHook.result.current.enableObscureCode(true);
  });
  expect(stateHook.result.current.passcode).not.toBe(null);
  expect(stateHook.result.current.obscureCodeEnabled).toBe(true);

  await act(async () => {
    await actionsHook.result.current.setPasscode(null);
  });

  const {passcode, obscureCodeEnabled, failedAttempts, lockUntil} =
    stateHook.result.current;

  expect({
    passcode,
    obscureCodeEnabled,
    failedAttempts,
    lockUntil,
  }).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('increments attempts and sets lockout', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);
  const actionsHook = await renderHook(() => useSecurityActions(), {wrapper});
  const stateHook = await renderHook(() => useSecurityState(), {wrapper});

  await act(async () => {
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.setLockUntil(123456789);
  });

  expect(stateHook.result.current.failedAttempts).toBe(2);
  expect(stateHook.result.current.lockUntil).toBe(123456789);
});

test('resets attempts and lockout', async () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);
  const actionsHook = await renderHook(() => useSecurityActions(), {wrapper});
  const stateHook = await renderHook(() => useSecurityState(), {wrapper});

  await act(async () => {
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.setLockUntil(999999);
    actionsHook.result.current.resetFailedAttempts();
  });

  expect(stateHook.result.current.failedAttempts).toBe(0);
  expect(stateHook.result.current.lockUntil).toBe(0);
});

describe('stale Keychain data after a reinstall', () => {
  const STORED = JSON.stringify({
    version: 1,
    state: {
      passcode: `${'a'.repeat(16)}:${'b'.repeat(64)}`,
      obscureCodeEnabled: false,
      failedAttempts: 0,
      lockUntil: 0,
      _hasHydrated: true,
    },
  });

  beforeEach(() => {
    jest.mocked(getItem).mockReturnValue(STORED);
    jest.mocked(deleteItemAsync).mockResolvedValue(undefined);
  });

  afterEach(() => {
    mockIsFreshInstall = false;
    jest.clearAllMocks();
  });

  test('a passcode left by a previous install is ignored and deleted', () => {
    mockIsFreshInstall = true;

    const store = createSecurityStore({persist: true});

    expect(store.instance.getState().passcode).toBeNull();
    expect(deleteItemAsync).toHaveBeenCalledWith('security');
  });

  test('a passcode belonging to this install is kept', () => {
    const store = createSecurityStore({persist: true});

    expect(store.instance.getState().passcode).not.toBeNull();
    expect(deleteItemAsync).not.toHaveBeenCalled();
  });
});
