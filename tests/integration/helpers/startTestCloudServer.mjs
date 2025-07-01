/**
 * @module
 * This script is run by tests.
 *
 * We want to start a fake cloud server in tests, but `@comapeo/cloud` only
 * supports ESM, which Jest does not support. This works around that.
 *
 * Alternatively, we could add CommonJS support to `@comapeo/cloud` or use
 * Jest's ESM support, but this workaround is, amazingly, easier.
 */

/* global console */
import comapeoServer from '@comapeo/cloud';
import createFastify from 'fastify';
import { randomBytes } from 'node:crypto';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import RAM from 'random-access-memory';

const COMAPEO_CORE_PKG_FOLDER = path.dirname(
  fileURLToPath(import.meta.resolve('@comapeo/core/package.json')),
);
const projectMigrationsFolder = path.join(
  COMAPEO_CORE_PKG_FOLDER,
  'drizzle/project',
);
const clientMigrationsFolder = path.join(
  COMAPEO_CORE_PKG_FOLDER,
  'drizzle/client',
);

const server = createFastify();

server.register(comapeoServer, {
  rootKey: randomBytes(16),
  projectMigrationsFolder,
  clientMigrationsFolder,
  dbFolder: ':memory:',
  coreStorage: () => new RAM(),
  serverName: 'test server',
  serverBearerToken: 'ignored',
});

console.log(await server.listen());
