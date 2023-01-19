// @ts-check
import os from 'os';
import debug from 'debug';
import rnBridge from 'rn-bridge';
import packageJson from './package.json';
import {getProjectDetails, init} from './app';

// TODO: Account for args passed from node.startWithArgs
debug.enable('*');

const log = debug('mapeo-mobile-node-next');

async function main() {
  log('Hello from the backend!');
  log(`Version ${packageJson.version}`);
  log(os.userInfo());

  await init();

  rnBridge.channel.post('start');

  rnBridge.channel.on('message', async msg => {
    log(`Received message: ${msg}`);

    const details = await getProjectDetails();

    log('PROJECT DETAILS (FROM NODE)', details);

    rnBridge.channel.post('message', JSON.stringify(details));
  });
}

main();
