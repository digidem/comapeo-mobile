import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

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
      <ActiveProjectIdStoreProvider store={store}>
        {children}
      </ActiveProjectIdStoreProvider>
    );
  };
}

test('usage of state and actions hooks', () => {
  const activeProjectStore = createActiveProjectIdStore();
  const wrapper = createWrapper(activeProjectStore);

  const actionsHook = renderHook(() => useActiveProjectIdActions(), {
    wrapper,
  });
  const stateHook = renderHook(() => useActiveProjectId(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual(undefined);

  act(() => {
    actionsHook.result.current.setActiveProjectId('project_1');
  });

  expect(stateHook.result.current).toStrictEqual('project_1');
});
