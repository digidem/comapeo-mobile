import {act, renderHook, waitFor} from '@testing-library/react-native';
import React, {type ReactNode} from 'react';
import type {MapeoManager} from '@comapeo/core';
import type {ComapeoCoreClientApi} from '@comapeo/ipc';

import {
  ActiveProjectIdStoreProvider,
  createActiveProjectIdStore,
  useActiveProjectIdActions,
  useActiveProjectId,
  type ActiveProjectIdStore,
} from './ActiveProjectIdStoreContext';
import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';
import {MapeoApiWrapper} from '../../../tests/integration/helpers/MapeoApiWrapper';

function createWrapper(
  store: ActiveProjectIdStore,
  client: ComapeoCoreClientApi,
) {
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
  let client: ComapeoCoreClientApi;
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

  test('if no project is available, store will be empty', async () => {
    const activeProjectStore = createActiveProjectIdStore();

    const wrapper = createWrapper(activeProjectStore, client);

    const stateHook = await renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    await waitFor(() => {
      expect(stateHook.result.current).toBeUndefined();
    });

    stateHook.unmount();
  });

  test('if project is available, store will populate with project', async () => {
    const projectId = await client.createProject({name: 'test project'});

    //empty store
    const activeProjectStore = createActiveProjectIdStore();

    const wrapper = createWrapper(activeProjectStore, client);

    const stateHook = await renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    await waitFor(() => {
      expect(stateHook.result.current).toStrictEqual(projectId);
    });

    stateHook.unmount();
  });

  test('setActiveProjectId action sets the active project ID', async () => {
    //empty store
    const activeProjectStore = createActiveProjectIdStore();

    const wrapper = createWrapper(activeProjectStore, client);

    const stateHook = await renderHook(() => useActiveProjectId(), {
      wrapper,
    });

    const actionsHook = await renderHook(() => useActiveProjectIdActions(), {
      wrapper,
    });

    await waitFor(() => {
      expect(stateHook.result.current).toBeUndefined();
    });

    await act(async () =>
      actionsHook.result.current.setActiveProjectId('12345'),
    );

    expect(stateHook.result.current).toBe('12345');

    actionsHook.unmount();
    stateHook.unmount();
  });
});
