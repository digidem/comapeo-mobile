// @ts-check
import os from 'node:os';
import debug from 'debug';
import packageJson from './package.json';
import rn_bridge from 'rn-bridge';

const log = debug('mapeo-mobile-node-next');

log('Hello from the backend!');
log(`Version ${packageJson.version}`);
log(os.userInfo());

rn_bridge.channel.on('message', msg => {
  log('');
  rn_bridge.channel.send(msg);
});

rn_bridge.channel.send('Node was initialized.');
