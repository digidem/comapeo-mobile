import * as React from 'react';
import {SafeAreaView, Text} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

import type {StatusMessage} from '../../backend/src/status';
import {MessagePortLike} from '../lib/MessagePortLike.js';
import {MapeoClientApi} from '@mapeo/ipc';

// Start this as soon as possible, e.g. before react renders
nodejs.start('loader.js');

const ApiContext = React.createContext<MapeoClientApi | undefined>(undefined);

export function useApi() {
  const api = React.useContext(ApiContext);
  if (!api) {
    throw new Error('No Api set, use ApiProvider to set one');
  }
  return api;
}

export const ApiProvider = ({
  messagePort,
  children,
  api,
}: React.PropsWithChildren<{
  messagePort: MessagePortLike;
  api: MapeoClientApi;
}>) => {
  const [serverStatus, setServerStatus] = React.useState<StatusMessage>({
    value: 'STARTING',
  });

  React.useEffect(() => {
    const subscription = nodejs.channel.addListener('server:status', msg => {
      if (msg.value === 'STARTED') {
        messagePort.start();
      }
      // TODO: Hide splash screen if status is `STARTED` or `ERROR`
      setServerStatus(msg);
    });
    // In case the server starts before us (we miss the original
    // `server-started` event), prompt the server to re-send.
    nodejs.channel.post('get-server-status');
    // @ts-ignore - incorrect types on nodejs.channel
    return () => subscription.remove();
  }, []);

  if (serverStatus.value === 'ERROR') {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error!</Text>
      </SafeAreaView>
    );
  }

  // Don't render any children while the backend is starting - this avoids
  // timeouts from API methods if server startup takes more than 5 seconds - all
  // api calls should be from children of this component.
  if (serverStatus.value === 'STARTING') {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Initializing Mapeo Core...</Text>
      </SafeAreaView>
    );
  }

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
