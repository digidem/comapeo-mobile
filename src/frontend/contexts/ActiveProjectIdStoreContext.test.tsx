import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import {type StateStorage} from 'zustand/middleware';

import {
  ActiveProjectIdStoreProvider,
  createActiveProjectIdStore,
  useActiveProjectIdActions,
  useActiveProjectId,
  type ActiveProjectIdStore,
} from './ActiveProjectIdStoreContext';

function createWrapper(store: ActiveProjectIdStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <ActiveProjectIdStoreProvider value={store}>
        {children}
      </ActiveProjectIdStoreProvider>
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
  const store = createActiveProjectIdStore({persist: false});
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(() => useActiveProjectIdActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useActiveProjectId(), {
    wrapper,
  });

  expect(stateHook.result.current).toBe(undefined);

  act(() => {
    actionsHook.result.current.setActiveProjectId('project_1');
  });

  expect(stateHook.result.current).toBe('project_1');
});

test('persistence', () => {
  const storage = new Map();

  {
    const store = createActiveProjectIdStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const actionsHook = renderHook(() => useActiveProjectIdActions(), {
      wrapper,
    });

    const stateHook = renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    expect(stateHook.result.current).toBe(undefined);

    expect(storage.size).toBe(0);

    act(() => {
      actionsHook.result.current.setActiveProjectId('project_1');
    });

    expect(storage.size).toBe(1);

    expect(stateHook.result.current).toBe('project_1');
  }

  // This tests that persisted value is used when setting up another store in isolation
  {
    const store = createActiveProjectIdStore({
      persist: true,
      storage: createStateStorage(storage),
    });

    const wrapper = createWrapper(store);

    const stateHook = renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    expect(stateHook.result.current).toBe('project_1');
  }
});
