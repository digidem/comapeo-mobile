import * as React from 'react';
import {SafeAreaView, Text} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';

import type {Status} from '../../../backend/src/status';
import {useServerStatus} from '../../stores/serverStatusStore';
import {useApiActions} from '../../stores/apiStore';

export const Loading = ({children}: React.PropsWithChildren<{}>) => {
  useNodejsMobileInit();
  const serverStatus = useServerStatus();
  useSetupApi(serverStatus);

  if (serverStatus === 'ERROR') {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error!</Text>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
};

function useNodejsMobileInit() {
  React.useEffect(() => {
    // TODO: Use startWithArgs and pass in other args that the backend expects
    nodejs.start('loader.js');
  }, []);
}

function useSetupApi(serverStatus: Status) {
  const {enable, disable} = useApiActions();

  if (serverStatus === 'CLOSED') {
    return disable();
  }

  if (serverStatus === 'LISTENING') {
    return enable();
  }
}
