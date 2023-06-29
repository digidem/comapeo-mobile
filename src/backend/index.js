// @ts-check
// import os from 'os';
import debug from 'debug';
import rn_bridge from 'rn-bridge';
import {createServer} from 'rpc-reflector';
import MessagePortLike from './lib/message-port-like.js';
import api from './api.js';

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

const channel = new MessagePortLike();

try {
  const {close} = createServer(api, channel);
  channel.start()
} catch (e) {
  rn_bridge.channel.send(`error initializing rpc-reflector: ${e}`);
}

// just to know if the backend is actually working
rn_bridge.channel.send('Node was initialized.');
