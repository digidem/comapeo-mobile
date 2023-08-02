import nodejs from 'nodejs-mobile-react-native';
import createClient from 'rpc-reflector/client';
import {MapeoApi} from '../../backend/mapeo-core';
import {MessagePortLike} from './MessagePortLike';

export const initClientApi = () => {
  const channel = new MessagePortLike(nodejs.channel);
  let started = false;
  nodejs.channel.addListener('server-started', _ => {
    // if the server responds then we know that it has started
    // Also this event can happen twice (on server start and
    // on asking server state), thats why we wrap it in
    // a conditional
    if (!started) {
      console.log('server started, starting port');
      channel.start();
      started = true;
    }
  });
  nodejs.channel.post('get-server-state');
  return createClient<MapeoApi>(channel);
};