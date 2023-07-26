// @ts-check
// import os from 'os';
import debug from 'debug';
import rn_bridge from 'rn-bridge';
import {createServer} from 'rpc-reflector';
import {MapeoClient} from './mapeo-core/index';
import MessagePortLike from './message-port-like.js';

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

// @ts-expect-error
const channel = new MessagePortLike(rn_bridge.channel);

try {
  const mapeoClient = new MapeoClient();
  const {close} = createServer(mapeoClient, channel);
} catch (e) {
  rn_bridge.channel.send(`error initializing rpc-reflector: ${e}`);
}

// just to know if the backend is actually working
rn_bridge.channel.send('Node was initialized.');
