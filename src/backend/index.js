// @ts-check
// import os from 'os';
import debug from 'debug';
import packageJson from './package.json';
import rn_bridge from 'rn-bridge';
import {createServer} from 'rpc-reflector';
import MessagePortLike from './lib/message-port-like.js';

export const api = {
  /** @param {String} who */
  greet: who => `hi ${who} from rpc-reflector`,
};

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

const log = debug('mapeo-mobile-node-next');

log('Hello from the backend!');
log(`Version ${packageJson.version}`);
// log(os.userInfo());

const channel = new MessagePortLike();

try {
  const {close} = createServer(api, channel);
} catch (e) {
  rn_bridge.channel.send(`error initializing rpc-reflector: ${e}`);
}

rn_bridge.channel.on('message', msg => {
  log(`Received message: ${msg}`);
  rn_bridge.channel.send(msg);
});

rn_bridge.channel.send('Node was initialized.');
