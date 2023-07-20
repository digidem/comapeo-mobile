import { useState, useEffect} from 'react';
import nodejs from 'nodejs-mobile-react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';
import {MapeoClient} from '../../shared/MapeoClient.js';
import {MessagePortLike} from '../MessagePortLike';

export const useClientApi = () => {
  const [clientApi, setClientApi] = useState<ClientApi<typeof MapeoClient>>();
  useEffect(() => {
    const channel = new MessagePortLike(nodejs.channel)
    setClientApi(createClient<typeof MapeoClient>(channel))
  },[]);
  return clientApi
};
