import * as React from 'react';
import * as SplashScreen from 'expo-splash-screen';

import {state, type ComapeoState} from '@comapeo/core-react-native';

export const ServerLoading = ({children}: React.PropsWithChildren) => {
  const [serverState, setServerState] = React.useState<ComapeoState>(() =>
    state.getState(),
  );

  React.useEffect(() => {
    const sub = state.addListener('stateChange', next => setServerState(next));
    return () => sub.remove();
  }, []);

  if (serverState === 'ERROR') {
    SplashScreen.hide();
    throw new Error('Server not loading');
  }

  // TODO: We could now render the app during the server startup, however
  // leaving as-is for now since this is the current behavior.
  if (serverState !== 'STARTED') {
    return null;
  }

  return <>{children}</>;
};
