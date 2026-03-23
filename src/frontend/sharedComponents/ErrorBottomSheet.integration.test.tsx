import type {MapeoManager} from '@comapeo/core';
import type {MapeoClientApi} from '@comapeo/ipc';

import {createManager, setUpIPC} from '../../../tests/integration/helpers/core';

/**
 * Integration test that triggers real errors from CoMapeo Core
 * to verify they have the expected structure (message, stack)
 * TODO: Add check for Error codes once updated to comapeo-core@6.0.0
 */
describe('ErrorBottomSheet - Real CoMapeo Core Errors', () => {
  let manager: MapeoManager;
  let client: MapeoClientApi;
  let onTeardown: Array<() => unknown> = [];
  let projectId: string;

  beforeEach(async () => {
    onTeardown = [];

    const setup = await createManager({name: 'test', deviceType: 'mobile'});
    manager = setup.manager;
    await setup.fastifyController.start();
    onTeardown.push(() => setup.fastifyController.stop());

    const ipc = setUpIPC({manager});
    client = ipc.client;
    onTeardown.push(ipc.stop);

    projectId = await client.createProject({name: undefined});
  });

  afterEach(async () => {
    for (const fn of onTeardown) await fn();
  });

  it('should get a real error from invalid device invite', async () => {
    const project = await client.getProject(projectId);

    let thrownError: Error & {code?: string};

    await project.$member
      .invite('non-existent-device-id-12345', {
        roleId: 'f7c150f5a3a9a855',
      })
      .catch(err => {
        thrownError = err;
      });

    expect(thrownError!).toBeInstanceOf(Error);
    expect(thrownError!.message).toBeDefined();
    expect(thrownError!.stack).toBeDefined();
  });

  it('should get a real error from invalid project ID', async () => {
    let thrownError: Error & {code?: string};

    await client.getProject('non-existent-project-id-12345').catch(err => {
      thrownError = err;
    });

    expect(thrownError!).toBeInstanceOf(Error);
    expect(thrownError!.message).toBeDefined();
    expect(thrownError!.message.length).toBeGreaterThan(0);
    expect(thrownError!.stack).toBeDefined();
    expect(thrownError!.name).toBeDefined();
  });

  it('should verify error structure matches what ErrorBottomSheet expects', async () => {
    let thrownError: Error & {code?: string};

    await client.getProject('invalid-project-id').catch(err => {
      thrownError = err;
    });

    const errorMessage = thrownError!.message || 'Unknown error';
    const errorStack = thrownError!.stack;

    expect(errorMessage).toBeDefined();
    expect(typeof errorMessage).toBe('string');
    expect(errorMessage.length).toBeGreaterThan(0);

    expect(errorStack).toBeDefined();
    expect(typeof errorStack).toBe('string');

    const displayedText = errorStack || errorMessage;
    expect(displayedText).toBeDefined();
    expect(displayedText.length).toBeGreaterThan(0);
  });
});
