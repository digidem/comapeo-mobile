import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {type StateStorage} from 'zustand/middleware';

import {type CoordinateFormat} from '../lib/coordinateFormat';
import {
  ManualEntryCoordinateFormatStoreProvider,
  ManualEntryCoordinateFormatStore,
  createManualEntryCoordinateFormatStore,
  useManualEntryCoordinateFormatActions,
  useManualEntryCoordinateFormat,
} from './ManualEntryCoordinateFormatStoreContext';

function createWrapper(store: ManualEntryCoordinateFormatStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <ManualEntryCoordinateFormatStoreProvider value={store}>
        {children}
      </ManualEntryCoordinateFormatStoreProvider>
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
  const store = createManualEntryCoordinateFormatStore({persist: false});
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(
    () => useManualEntryCoordinateFormatActions(),
    {wrapper},
  );

  const stateHook = renderHook(() => useManualEntryCoordinateFormat(), {
    wrapper,
  });

  expect(stateHook.result.current).toBe('utm');

  for (const f of ['dd', 'dms', 'utm'] satisfies Array<CoordinateFormat>) {
    act(() => {
      actionsHook.result.current.setFormat(f);
    });

    expect(stateHook.result.current).toBe(f);
  }
});

test('persistence', () => {
  const storage = new Map();

  {
    const store = createManualEntryCoordinateFormatStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const actionsHook = renderHook(
      () => useManualEntryCoordinateFormatActions(),
      {wrapper},
    );

    const stateHook = renderHook(() => useManualEntryCoordinateFormat(), {
      wrapper,
    });

    expect(stateHook.result.current).toBe('utm');

    expect(storage.size).toBe(0);

    act(() => {
      actionsHook.result.current.setFormat('dd');
    });

    expect(storage.size).toBe(1);

    expect(stateHook.result.current).toBe('dd');
  }

  // This tests that persisted value is used when setting up another store in isolation
  {
    const store = createManualEntryCoordinateFormatStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useManualEntryCoordinateFormat(), {
      wrapper,
    });

    expect(stateHook.result.current).toBe('dd');
  }
});
