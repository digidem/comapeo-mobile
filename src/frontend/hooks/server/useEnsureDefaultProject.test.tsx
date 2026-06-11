import {renderHook} from '@testing-library/react-native';
import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';
import React, {type ReactNode} from 'react';

import {useEnsureDefaultProject} from './useEnsureDefaultProject';
import {
  createManager,
  setUpIPC,
} from '../../../../tests/integration/helpers/core';
import {MapeoApiWrapper} from '../../../../tests/integration/helpers/MapeoApiWrapper';

function createWrapper(client: MapeoClientApi) {
  return ({children}: {children: ReactNode}) => {
    return <MapeoApiWrapper mapeoApi={client}>{children}</MapeoApiWrapper>;
  };
}

function renderEnsureDefaultProject(client: MapeoClientApi) {
  const {result} = renderHook(() => useEnsureDefaultProject(), {
    wrapper: createWrapper(client),
  });
  return result.current;
}

function createFailingCreateClient(client: MapeoClientApi): MapeoClientApi {
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop === 'createProject') {
        return () => Promise.reject(new Error('create failed'));
      }
      return Reflect.get(target, prop, receiver);
    },
  });
}

describe('useEnsureDefaultProject', () => {
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

  test('returns the existing default (unnamed) project without creating one', async () => {
    const namedProjectId = await client.createProject({name: 'named project'});
    const defaultProjectId = await client.createProject();
    expect(namedProjectId).not.toEqual(defaultProjectId);

    const ensureDefaultProject = renderEnsureDefaultProject(client);

    await expect(ensureDefaultProject()).resolves.toEqual(defaultProjectId);

    const projects = await client.listProjects();
    expect(projects).toHaveLength(2);
  });

  test('creates a default project when none exists', async () => {
    await client.createProject({name: 'named project'});

    const ensureDefaultProject = renderEnsureDefaultProject(client);

    const result = await ensureDefaultProject();

    const projects = await client.listProjects();
    expect(projects).toHaveLength(2);
    const unnamed = projects.filter(project => !project.name);
    expect(unnamed).toHaveLength(1);
    expect(result).toEqual(unnamed[0]!.projectId);
  });

  test('ignores the excluded project when looking for the default', async () => {
    const excludedId = await client.createProject();

    const ensureDefaultProject = renderEnsureDefaultProject(client);

    const result = await ensureDefaultProject({excludeProjectId: excludedId});

    expect(result).not.toEqual(excludedId);
    const projects = await client.listProjects();
    expect(projects).toHaveLength(2);
  });

  test('concurrent calls create exactly one project', async () => {
    const ensureDefaultProject = renderEnsureDefaultProject(client);

    const [first, second, third] = await Promise.all([
      ensureDefaultProject(),
      ensureDefaultProject(),
      ensureDefaultProject(),
    ]);

    expect(second).toEqual(first);
    expect(third).toEqual(first);
    const projects = await client.listProjects();
    expect(projects).toHaveLength(1);
  });

  test('falls back to another joined project if creation fails', async () => {
    const namedProjectId = await client.createProject({name: 'named project'});

    const ensureDefaultProject = renderEnsureDefaultProject(
      createFailingCreateClient(client),
    );

    await expect(ensureDefaultProject()).resolves.toEqual(namedProjectId);
  });

  test('rejects if creation fails and no other project exists', async () => {
    const ensureDefaultProject = renderEnsureDefaultProject(
      createFailingCreateClient(client),
    );

    await expect(ensureDefaultProject()).rejects.toThrow('create failed');
  });
});
