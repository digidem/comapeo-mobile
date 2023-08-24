import * as React from 'react';
import {SafeAreaView, Text} from 'react-native';
import nodejs from 'nodejs-mobile-react-native';
import createClient from 'rpc-reflector/client';
import {MessagePortLike} from '../lib/MessagePortLike';
import {Status, StatusMessage} from '../../backend/types/api';

import {setApi} from '../api';

export const Loading = ({children}: React.PropsWithChildren<{}>) => {
  const [status, setStatus] = React.useState<Status>('idle');

  React.useEffect(() => {
    // This is a subscription object but nodejs mobile types are broken
    const statusSubscription = nodejs.channel.addListener(
      'status',
      (status: StatusMessage) => {
        console.log('STATUS RECEIVED', status);
        setStatus(prev => {
          if (prev === status.value) return prev;
          else return status.value;
        });
      },
    );

    return () => {
      // @ts-expect-error
      statusSubscription.remove();
    };
  }, []);

  React.useEffect(() => {
    let channel: MessagePortLike | undefined;

    console.log(status);

    if (status === 'idle') {
      nodejs.start('loader.js');
      channel = new MessagePortLike();
      setApi(createClient(channel));
      channel.start();
    }

    return () => {
      // TODO: Not sure if this is needed
      if (status === 'closed' && channel) {
        channel.close();
      }
    };
  }, [status]);

  if (status === 'error') {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Error!</Text>
      </SafeAreaView>
    );
  }

  if (status === 'listening') {
    return <>{children}</>;
  }

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );
};
