// @ts-check
import os from 'node:os';
import debug from 'debug';
import packageJson from './package.json';

const log = debug('mapeo-mobile-node-next');

log('Hello from the backend!');
log(`Version ${packageJson.version}`);
log(os.userInfo());
