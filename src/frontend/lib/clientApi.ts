import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../backend/mapeo-core';
import {MessagePortLike} from './MessagePortLike';

export const initClientApi = () => {
  const channel = new MessagePortLike(nodejs.channel);
  return createClient<ClientApi<typeof MapeoClient>>(channel);
  // MOCK DATA
  // for (let i = 0; i < 10; i++) {
  //   const lat = Math.random() * 180 - 90;
  //   const lon = Math.random() * 180 - 90;
  //   const types = ['animal', 'floor', 'plant', 'mine', 'burial site'];
  //   const idx = Math.floor(Math.random() * types.length);
  //   const doc = {lat, lon, tags: {type: types[idx]}};
  //   clientApi?.observation
  //     .create(doc)
  //     .then(() => {})
  //     .catch(console.error);
  // }
};
