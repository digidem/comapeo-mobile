import {act, renderHook, waitFor} from '@testing-library/react-native';
import React, {type ReactNode} from 'react';
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
import {MapeoApiWrapper} from '../../../tests/integration/helpers/MapeoApiWrapper';

function createWrapper(store: ActiveProjectIdStore, client: MapeoClientApi) {
  return ({children}: {children: ReactNode}) => {
    return (
      <MapeoApiWrapper mapeoApi={client}>
        <ActiveProjectIdStoreProvider store={store}>
          {children}
        </ActiveProjectIdStoreProvider>
      </MapeoApiWrapper>
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
    const projectId = await client.createProject({name: 'test project'});

    const activeProjectStore = createActiveProjectIdStore();

    const wrapper = createWrapper(activeProjectStore, client);

    const actionsHook = renderHook(() => useActiveProjectIdActions(), {
      wrapper,
    });
    const stateHook = renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    await waitFor(() => {
      expect(stateHook.result.current).toStrictEqual(projectId);
    });

    act(() => {
      actionsHook.result.current.setActiveProjectId('project_1');
    });

    expect(stateHook.result.current).toStrictEqual('project_1');
  });
});
