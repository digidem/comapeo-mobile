import * as React from 'react';
import {PermissionsAndroid, SafeAreaView, Text} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import BootSplash from 'react-native-bootsplash';

import type {StatusMessage} from '../backend/src/status';
import {MessagePortLike} from './lib/MessagePortLike.js';

export const ServerLoading = ({
  messagePort,
  children,
}: React.PropsWithChildren<{messagePort: MessagePortLike}>) => {
  const [serverStatus, setServerStatus] = React.useState<StatusMessage>({
    value: 'STARTING',
  });

  const permissionsAnswered = useRequestPermissions();

  React.useEffect(() => {
    const subscription = nodejs.channel.addListener('server:status', msg => {
      if (msg.value === 'STARTED') {
        messagePort.start();
      }

      if (
        permissionsAnswered &&
        (msg.value === 'STARTED' || msg.value === 'ERROR')
      ) {
        BootSplash.hide({fade: true});
      }

      setServerStatus(msg);
    });

    // In case the server starts before us (we miss the original
    // `server-started` event), prompt the server to re-send.
    nodejs.channel.post('get-server-status');

    // @ts-ignore - incorrect types on nodejs.channel
    return () => subscription.remove();
  }, [setServerStatus, permissionsAnswered]);

  // Don't render any children while the backend is starting - this avoids
  // timeouts from API methods if server startup takes more than 5 seconds - all
  // api calls should be from children of this component.
  if (serverStatus.value === 'STARTING') {
    return null;
  }

  if (serverStatus.value === 'ERROR') {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error!</Text>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

function useRequestPermissions() {
  const [permissionsAnswered, setPermissionsAnswered] = React.useState(false);

  React.useEffect(() => {
    PermissionsAndroid.requestMultiple([
      'android.permission.CAMERA',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
    ]).then(() => {
      setPermissionsAnswered(true);
    });
  }, []);

  return permissionsAnswered;
}
