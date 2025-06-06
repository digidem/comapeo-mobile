import path from 'node:path';
import {MessageChannel} from 'node:worker_threads';
import {FastifyController, MapeoManager} from '@comapeo/core';
import {
  closeMapeoClient,
  createMapeoClient,
  createMapeoServer,
} from '@comapeo/ipc';
import {KeyManager} from '@mapeo/crypto';
import Fastify from 'fastify';
import RAM from 'random-access-memory';

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

  const server = createMapeoServer(manager, port1);
  const client = createMapeoClient(port2);

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
      await closeMapeoClient(client);
      port1.close();
      port2.close();
    },
  };
}
