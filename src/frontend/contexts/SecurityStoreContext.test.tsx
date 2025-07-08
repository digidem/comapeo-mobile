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
  });

  act(() => {
    actionsHook.result.current.enableObscureCode(true);
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: '12345',
    obscureCodeEnabled: true,
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
  });

  act(() => {
    actionsHook.result.current.setPasscode(null);
  });

  expect(stateHook.result.current).toStrictEqual({
    passcode: null,
    obscureCodeEnabled: false,
  });
});
