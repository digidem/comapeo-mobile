import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../backend/mapeo-core';
import {MessagePortLike} from './MessagePortLike';

export const initClientApi = () => {
  const channel = new MessagePortLike(nodejs.channel);
  nodejs.channel.addListener('server-started', state => {
    console.log('server started, starting port', state);
    // if the server responds then we know that it has started
    channel.start();
  });
  nodejs.channel.post('get-server-state');
  return createClient<ClientApi<typeof MapeoClient>>(channel);
};
