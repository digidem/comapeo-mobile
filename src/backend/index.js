// @ts-check
import os from 'os';
import debug from 'debug';
import packageJson from './package.json';
import rn_bridge from 'rn-bridge';

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

const log = debug('mapeo-mobile-node-next');

log('Hello from the backend!');
log(`Version ${packageJson.version}`);
log(os.userInfo());

rn_bridge.channel.on('message', msg => {
  log(`Received message: ${msg}`);
  rn_bridge.channel.send(msg);
});

rn_bridge.channel.send('Node was initialized.');
