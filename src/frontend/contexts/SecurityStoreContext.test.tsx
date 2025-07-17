import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSecurityStore,
  type SecurityStore,
  SecurityStoreProvider,
  useSecurityActions,
  useSecurityState,
} from './SecurityStoreContext';
import {DEFAULT_OBSCURE_CODE} from '../lib/security';

function createWrapper(settingsStore: SecurityStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SecurityStoreProvider value={settingsStore}>
        {children}
      </SecurityStoreProvider>
    );
  };
}

test('initial state', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = renderHook(() => useSecurityState(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('passcode cannot be set to invalid value', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(() => useSecurityActions(), {
    wrapper,
  });
  const stateHook = renderHook(() => useSecurityState(), {
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
    expect(() => {
      actionsHook.result.current.setPasscode(v);
    }).toThrow();
  }

  expect(stateHook.result.current).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('obscure code cannot be set when passcode is not set', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(() => useSecurityActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useSecurityState(), {
    wrapper,
  });

  expect(() => {
    actionsHook.result.current.enableObscureCode(true);
  }).toThrow();

  expect(stateHook.result.current).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('obscure code has expected value when enabled', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = renderHook(() => useSecurityState(), {
    wrapper,
  });

  const actionsHook = renderHook(() => useSecurityActions(), {
    wrapper,
  });

  act(() => {
    actionsHook.result.current.setPasscode('12345');
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: '12345',
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });

  act(() => {
    actionsHook.result.current.enableObscureCode(true);
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: '12345',
    obscureCodeEnabled: true,
    failedAttempts: 0,
    lockUntil: 0,
  });
});

test('obscure code is unset when passcode is unset', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);

  const stateHook = renderHook(() => useSecurityState(), {
    wrapper,
  });

  const actionsHook = renderHook(() => useSecurityActions(), {
    wrapper,
  });

  act(() => {
    actionsHook.result.current.setPasscode('12345');
    actionsHook.result.current.enableObscureCode(true);
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: '12345',
    obscureCodeEnabled: true,
    failedAttempts: 0,
    lockUntil: 0,
  });

  act(() => {
    actionsHook.result.current.setPasscode(null);
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
    failedAttempts: 0,
    lockUntil: 0,
  });
});
test('increments attempts and sets lockout', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);
  const actionsHook = renderHook(() => useSecurityActions(), {wrapper});
  const stateHook = renderHook(() => useSecurityState(), {wrapper});

  act(() => {
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.setLockout(123456789);
  });

  expect(stateHook.result.current.failedAttempts).toBe(2);
  expect(stateHook.result.current.lockUntil).toBe(123456789);
});
test('resets attempts and lockout', () => {
  const store = createSecurityStore();
  const wrapper = createWrapper(store);
  const actionsHook = renderHook(() => useSecurityActions(), {wrapper});
  const stateHook = renderHook(() => useSecurityState(), {wrapper});

  act(() => {
    actionsHook.result.current.incrementAndGetAttempts();
    actionsHook.result.current.setLockout(999999);
    actionsHook.result.current.resetFailedAttempts();
  });

  expect(stateHook.result.current.failedAttempts).toBe(0);
  expect(stateHook.result.current.lockUntil).toBe(0);
});
