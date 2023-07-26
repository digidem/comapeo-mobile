// @ts-check
// import os from 'os';
import debug from 'debug';
import rn_bridge from 'rn-bridge';
import {createServer} from 'rpc-reflector';
import {MapeoClient} from './mapeo-core/index';
import MessagePortLike from './message-port-like.js';
import {mockData} from './mockData.js';

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

rn_bridge.channel.on('get-server-state', () => {
  rn_bridge.channel.post('server-started', true);
});

// @ts-expect-error
const channel = new MessagePortLike(rn_bridge.channel);
channel.start();
try {
  const mapeoClient = new MapeoClient();
  mockData.forEach(async doc => {
    try {
      await mapeoClient.observation.create(doc);
    } catch (e) {
      console.error('error creating the document', e);
    }
  });
  const {close} = createServer(mapeoClient, channel);
} catch (e) {
  console.error(`error initializing rpc-reflector: ${e}`);
}

console.log('Node was initialized.');
