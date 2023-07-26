import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../backend/mapeo-core';
import {MessagePortLike} from './MessagePortLike';

export const initClientApi = () => {
  const channel = new MessagePortLike(nodejs.channel);
  return createClient<ClientApi<typeof MapeoClient>>(channel);
};
