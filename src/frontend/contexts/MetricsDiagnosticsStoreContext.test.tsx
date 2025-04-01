import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {type StateStorage} from 'zustand/middleware';

import {
  MetricsDiagnosticsStoreProvider,
  createMetricsDiagnosticsStore,
  useMetricsDiagnosticsActions,
  useMetricsDiagnosticsEnabled,
  type MetricsDiagnosticsStore,
} from './MetricsDiagnosticsStoreContext';

function createWrapper(store: MetricsDiagnosticsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <MetricsDiagnosticsStoreProvider value={store}>
        {children}
      </MetricsDiagnosticsStoreProvider>
    );
  };
}

function createStateStorage(
  storage: Map<
    string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any
  >,
): StateStorage {
  return {
    getItem: name => {
      return storage.get(name);
    },
    setItem: (name, value) => {
      storage.set(name, value);
    },
    removeItem: name => {
      storage.delete(name);
    },
  };
}

test('usage of state and actions hooks', () => {
  const store = createMetricsDiagnosticsStore({persist: false});
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(() => useMetricsDiagnosticsActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useMetricsDiagnosticsEnabled(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual(true);

  act(() => {
    actionsHook.result.current.setIsEnabled(false);
  });

  expect(stateHook.result.current).toStrictEqual(false);

  act(() => {
    actionsHook.result.current.setIsEnabled(true);
  });

  expect(stateHook.result.current).toStrictEqual(true);
});

test('persistence', () => {
  const storage = new Map();

  {
    const store = createMetricsDiagnosticsStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const actionsHook = renderHook(() => useMetricsDiagnosticsActions(), {
      wrapper,
    });

    const stateHook = renderHook(() => useMetricsDiagnosticsEnabled(), {
      wrapper,
    });

    expect(stateHook.result.current).toStrictEqual(true);

    expect(storage.size).toBe(0);

    act(() => {
      actionsHook.result.current.setIsEnabled(false);
    });

    expect(storage.size).toBe(1);

    expect(stateHook.result.current).toStrictEqual(false);
  }

  {
    const store = createMetricsDiagnosticsStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useMetricsDiagnosticsEnabled(), {
      wrapper,
    });

    expect(stateHook.result.current).toBe(false);
  }
});
