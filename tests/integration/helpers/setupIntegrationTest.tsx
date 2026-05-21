import {render} from '@testing-library/react-native';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';
import {createManager, setUpIPC} from './core';
import {createAppProvidersWrapper} from './react';
import {MockedAppNavigator} from './navigation';
import {sleep} from '../../../src/frontend/lib/sleep';
import React from 'react';

export function setupIntegrationTest() {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];
  let projectId: string;

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
    projectId = await client.createProject({name: undefined});
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  const renderNavigation = ({
    isOnline = true,
    activeProjectId = projectId,
  }: Readonly<{isOnline?: boolean; activeProjectId?: string}> = {}) => {
    const appProviders = createAppProvidersWrapper({
      mapeoApi: client,
      isOnline,
      activeProjectId,
    });
    onTeardown.push(appProviders.teardown);

    const {unmount} = render(<MockedAppNavigator />, {
      wrapper: appProviders.wrapper,
    });
    const actualTeardown = async () => {
      unmount();
      await sleep(0);
    };

    onTeardown.unshift(actualTeardown);

    return () => {
      const result = actualTeardown();
      onTeardown = onTeardown.filter(fn => fn !== actualTeardown);
      return result;
    };
  };

  return {
    renderNavigation,
    get projectId() {
      return projectId;
    },
    get client() {
      return client;
    },
    get manager() {
      return manager;
    },
  };
}
