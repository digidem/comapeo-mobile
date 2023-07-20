import {useState, useEffect} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../backend/mapeo-core';
import {MessagePortLike} from '../MessagePortLike';

export const useClientApi = () => {
  const [clientApi, setClientApi] = useState<ClientApi<typeof MapeoClient>>();
  useEffect(() => {
    const channel = new MessagePortLike(nodejs.channel);
    setClientApi(createClient<typeof MapeoClient>(channel));
    for (let i = 0; i < 10; i++) {
      const lat = Math.random() * 180 - 90;
      const lon = Math.random() * 180 - 90;
      const types = ['animal', 'floor', 'plant', 'mine', 'burial site'];
      const idx = Math.floor(Math.random() * types.length);
      const doc = {lat, lon, tags: {type: types[idx]}}
      clientApi?.observation.create(doc).then(console.log).catch(console.error);
    }
  }, []);
  return clientApi;
};
