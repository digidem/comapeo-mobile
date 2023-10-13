// @ts-check
import debug from 'debug';
import rn_bridge from 'rn-bridge';
import {createServer} from 'rpc-reflector';
import {MapeoClient} from './mapeo-core/index';
import MessagePortLike from './message-port-like.js';
import {MockPreset, mockObservations} from './mockData.js';

/** @typedef {Object} State
 *
 * @property {import('./types/api').Status} State.status
 */

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

const log = debug('mapeo:index');

log('Starting Node...');

// 1. Initialize server state
/** @type {State} */
const state = {
  status: 'idle',
};

// 2. Initialize Mapeo API server
const mapeoClient = new MapeoClient();

// MockPreset.forEach(doc => {
//   mapeoClient.preset.create(doc);
// });

// mockObservations.forEach(doc => {
//   mapeoClient.observation.create(doc);
// });

const channel = new MessagePortLike();

const {close} = createServer(mapeoClient, channel);

channel.start();

// 3. Initialize event listeners
rn_bridge.channel.on('get-status', () => {
  rn_bridge.channel.post('status', state.status);
});

rn_bridge.channel.on('close', () => {
  close();
});

process.on('exit', () => {
  close();
});

// 4. Send initial status message to client
state.status = 'listening';
rn_bridge.channel.post('status', {value: state.status});

log('Node was initialized!');
