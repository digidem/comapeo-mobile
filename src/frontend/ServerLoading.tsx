import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import BootSplash from 'react-native-bootsplash';

import type {StatusMessage} from '../backend/src/status';
import {MessagePortLike} from './lib/MessagePortLike.js';
import {FatalError} from './screens/FatalError';

export const ServerLoading = ({
  messagePort,
  children,
}: React.PropsWithChildren<{messagePort: MessagePortLike}>) => {
  const [serverStatus, setServerStatus] = React.useState<StatusMessage>({
    value: 'STARTING',
  });
  console.log(serverStatus);

  React.useEffect(() => {
    const subscription = nodejs.channel.addListener('server:status', msg => {
      if (msg.value === 'STARTED') {
        messagePort.start();
      }

      setServerStatus(msg);
    });

    // In case the server starts before us (we miss the original
    // `server-started` event), prompt the server to re-send.
    nodejs.channel.post('get-server-status');

    // @ts-ignore - incorrect types on nodejs.channel
    return () => subscription.remove();
  }, [setServerStatus]);

  // Don't render any children while the backend is starting - this avoids
  // timeouts from API methods if server startup takes more than 5 seconds - all
  // api calls should be from children of this component.
  if (serverStatus.value === 'STARTING') {
    return null;
  }

  if (serverStatus.value === 'ERROR') {
    BootSplash.hide();
    return <FatalError />;
  }

  return <>{children}</>;
};
