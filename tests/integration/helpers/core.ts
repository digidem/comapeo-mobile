import {spawn} from 'node:child_process';
import path from 'node:path';
import {MessageChannel} from 'node:worker_threads';
import {FastifyController, MapeoManager} from '@comapeo/core';
import type {ComapeoProjectClientApi} from '@comapeo/ipc';
import {
  closeComapeoCoreClient,
  createComapeoCoreClient,
  createComapeoCoreServer,
} from '@comapeo/ipc';
import {KeyManager} from '@mapeo/crypto';
import Fastify from 'fastify';
import {randomBytes} from 'node:crypto';
import {pEvent} from 'p-event';
import pEvery from 'p-every';
import RAM from 'random-access-memory';
import {MEMBER_ROLE_ID} from '../../../src/frontend/sharedTypes';

const COMAPEO_CORE_PKG_FOLDER = path.dirname(
  require.resolve('@comapeo/core/package.json'),
);
const projectMigrationsFolder = path.join(
  COMAPEO_CORE_PKG_FOLDER,
  'drizzle/project',
);
const clientMigrationsFolder = path.join(
  COMAPEO_CORE_PKG_FOLDER,
  'drizzle/client',
);

export async function createManager(
  deviceInfo: Pick<
    Parameters<typeof MapeoManager.prototype.setDeviceInfo>[0],
    'name' | 'deviceType'
  >,
) {
  const fastify = Fastify();

  const manager = new MapeoManager({
    rootKey: KeyManager.generateRootKey(),
    dbFolder: ':memory:',
    coreStorage: () => new RAM(),
    projectMigrationsFolder,
    clientMigrationsFolder,
    fastify,
  });
  await manager.setDeviceInfo(deviceInfo);

  const fastifyController = new FastifyController({fastify});

  return {
    manager,
    fastifyController,
  };
}

export function setUpIPC({manager}: {manager: MapeoManager}) {
  const {port1, port2} = new MessageChannel();

  // Cast needed: Node's MessagePort type doesn't match rpc-reflector's
  // MessagePortLike, though it satisfies it at runtime.
  const server = createComapeoCoreServer(
    manager,
    port1 as unknown as Parameters<typeof createComapeoCoreServer>[1],
  );
  const client = createComapeoCoreClient(
    port2 as unknown as Parameters<typeof createComapeoCoreClient>[0],
    {timeout: 30_000},
  );

  return {
    client,
    clientPort: port2,
    server,
    serverPort: port1,
    start: () => {
      port1.start();
      port2.start();
    },
    stop: async () => {
      server.close();
      await closeComapeoCoreClient(client);
      port1.close();
      port2.close();
    },
  };
}

export async function connectPeers(
  managers: ReadonlyArray<MapeoManager>,
): Promise<() => Promise<void>> {
  await tellPeersAboutEachOther(managers);
  await waitForPeersToBeConnected(managers);
  return () => stopPeerDiscovery(managers);
}

async function tellPeersAboutEachOther(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  await Promise.all(
    managers.map(async manager => {
      const {name, port} = await manager.startLocalPeerDiscoveryServer();
      for (const otherManager of managers) {
        if (otherManager === manager) continue;
        otherManager.connectLocalPeer({address: '127.0.0.1', name, port});
      }
    }),
  );
}

async function waitForPeersToBeConnected(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  const deviceIds = new Set(managers.map(m => m.deviceId));

  const isDone = async (): Promise<boolean> =>
    pEvery(managers, async manager => {
      const unconnectedDeviceIds = new Set(deviceIds);
      unconnectedDeviceIds.delete(manager.deviceId);
      for (const peer of await manager.listLocalPeers()) {
        if (peer.status === 'connected') {
          unconnectedDeviceIds.delete(peer.deviceId);
        }
      }
      return unconnectedDeviceIds.size === 0;
    });

  if (await isDone()) return;

  return new Promise(res => {
    const onLocalPeers = async () => {
      if (await isDone()) {
        for (const manager of managers) {
          manager.off('local-peers', onLocalPeers);
        }
        res();
      }
    };
    for (const manager of managers) manager.on('local-peers', onLocalPeers);
  });
}

async function stopPeerDiscovery(
  managers: ReadonlyArray<MapeoManager>,
): Promise<void> {
  await Promise.all(
    managers.map(manager =>
      manager.stopLocalPeerDiscoveryServer({force: true}),
    ),
  );
}

export async function inviteToProject(
  project: ComapeoProjectClientApi,
  invitee: MapeoManager,
): Promise<void> {
  const inviteId = randomBytes(32);

  const inviteeInvitePromise = pEvent(
    invitee.invite,
    'invite-received',
    invite =>
      Buffer.from((invite as {inviteId: string}).inviteId, 'hex').equals(
        inviteId,
      ),
  );

  await Promise.all([
    project.$member.invite(invitee.deviceId, {
      roleId: MEMBER_ROLE_ID,
      __testOnlyInviteId: inviteId,
    }),
    (async () => {
      const invite = (await inviteeInvitePromise) as {inviteId: string};
      await invitee.invite.accept(invite);
    })(),
  ]);
}

export const createTestServer = (): Promise<{
  serverBaseUrl: string;
  close: () => void;
}> =>
  new Promise((resolve, reject) => {
    const startServerPath =
      require.resolve('../../../tests/integration/helpers/startTestCloudServer.mjs');
    const childProcess = spawn('node', [startServerPath], {
      stdio: ['ignore', 'pipe', 'inherit'],
    });

    childProcess.unref();

    // @comapeo/core needs to reach the server spawned above (e.g. to add it
    // as a peer).
    const callFetch = useRealFetch();

    childProcess.stdout.on('data', data => {
      const url = data.toString().trim();

      if (urlIsValid(url)) {
        resolve({
          serverBaseUrl: url,
          close: () => {
            childProcess.kill('SIGTERM');
            callFetch();
          },
        });
      } else {
        childProcess.kill();
        callFetch();
        reject(new Error('Test is not set up correctly: invalid URL'));
      }
    });

    childProcess.on('close', code => {
      // If `code` is `null`, the process was terminated by a signal, like the
      // one above.
      if (code !== null) {
        reject(
          new Error(
            `Test is not set up correctly: server code ended early with code ${code}`,
          ),
        );
      }
    });
  });

// jest-expo subs `fetch` with a non-working stub; this swaps in undici's real implementation.
export function useRealFetch(): () => void {
  const originalFetch = global.fetch;
  const originalHeaders = global.Headers;
  const originalResponse = global.Response;

  const {fetch, Headers, Response} = require('undici');
  global.fetch = fetch;
  global.Headers = Headers;
  global.Response = Response;

  return () => {
    global.fetch = originalFetch;
    global.Headers = originalHeaders;
    global.Response = originalResponse;
  };
}

function urlIsValid(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
