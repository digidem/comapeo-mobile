import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import type {StatusMessage} from '../backend/src/status';
import {MessagePortLike} from './lib/MessagePortLike.js';
import {FatalError} from './screens/FatalError';

export const ServerLoading = ({
  messagePort,
  requestServerStatus,
  subscribeToServerStatus,
  children,
}: React.PropsWithChildren<{
  messagePort: MessagePortLike;
  requestServerStatus: () => unknown;
  subscribeToServerStatus: (
    listener: (msg: StatusMessage) => unknown,
  ) => () => void;
}>) => {
  const [serverStatus, setServerStatus] = React.useState<StatusMessage>({
    value: 'STARTING',
  });

  React.useEffect(() => {
    const unsubscribe = subscribeToServerStatus(msg => {
      if (msg.value === 'STARTED') {
        messagePort.start();
      }

      setServerStatus(msg);
    });

    // In case the server starts before us (we miss the original
    // "server started" event), prompt the server to re-send.
    requestServerStatus();

    return unsubscribe;
  }, [
    messagePort,
    requestServerStatus,
    subscribeToServerStatus,
    setServerStatus,
  ]);

  // Don't render any children while the backend is starting - this avoids
  // timeouts from API methods if server startup takes more than 5 seconds - all
  // api calls should be from children of this component.
  if (serverStatus.value === 'STARTING') {
    return null;
  }

  if (serverStatus.value === 'ERROR') {
    SplashScreen.hide();
    return <FatalError />;
  }

  return <>{children}</>;
};
