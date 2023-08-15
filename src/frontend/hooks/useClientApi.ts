import {useState, useEffect} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../backend/mapeo-core';
import {MessagePortLike} from '../lib/MessagePortLike';

export const useClientApi = () => {
  const [clientApi, setClientApi] = useState<ClientApi<typeof MapeoClient>>();
  useEffect(() => {
    const channel = new MessagePortLike();
    let started = false;
    nodejs.channel.addListener('server-started', _ => {
      // if the server responds then we know that it has started
      // Also this event can happen twice (on server start and
      // on asking server state), thats why we wrap it in
      // a conditional, so we avoid starting the channel twice
      if (!started) {
        console.log('server started, starting port');
        channel.start();
        started = true;
      }
    });
    nodejs.channel.post('get-server-state');
    setClientApi(createClient<ClientApi<typeof MapeoClient>>(channel));

    return () => {
      // what cleanup should be done here?
    };
  }, []);

  return clientApi;
};
