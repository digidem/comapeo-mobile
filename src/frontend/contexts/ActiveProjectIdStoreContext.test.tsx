import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {
  ActiveProjectIdStoreProvider,
  createActiveProjectIdStore,
  useActiveProjectIdActions,
  useActiveProjectId,
  type ActiveProjectIdStore,
} from './ActiveProjectIdStoreContext';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {createAppProvidersWrapper} from '../../../tests/integration/helpers/react';

function createWrapper(
  store: ActiveProjectIdStore,
  appProviders: ReturnType<typeof createAppProvidersWrapper>,
) {
  return ({children}: {children: ReactNode}) => {
    const AppProviders = appProviders.wrapper;
    return (
      <AppProviders>
        <ActiveProjectIdStoreProvider store={store}>
          {children}
        </ActiveProjectIdStoreProvider>
      </AppProviders>
    );
  };
}

describe('ActiveProjectIdStore', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];

  beforeEach(async () => {
    onTeardown = [];

    const managerSetup = await createManager({
      name: 'test',
      deviceType: 'mobile',
    });
    ({manager} = managerSetup);
    const {fastifyController} = managerSetup;

    const ipcSetup = setUpIPC({manager});
    ({client} = ipcSetup);
    const {stop} = ipcSetup;
    onTeardown.push(stop);

    await fastifyController.start();
    onTeardown.push(() => fastifyController.stop());
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  test('usage of state and actions hooks', async () => {
    const activeProjectStore = createActiveProjectIdStore();
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
    });
    onTeardown.push(appProviders.teardown);

    const wrapper = createWrapper(activeProjectStore, appProviders);

    const actionsHook = renderHook(() => useActiveProjectIdActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(stateHook.result.current).toStrictEqual(undefined);

    act(() => {
      actionsHook.result.current.setActiveProjectId('project_1');
    });

    expect(stateHook.result.current).toStrictEqual('project_1');
  });
});
