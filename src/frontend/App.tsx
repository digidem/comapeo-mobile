import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, Text, TextInput} from 'react-native';

const App = () => {
  const [messageText, setMessageText] = React.useState('');

  const channel = useNodejsMobile();

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <Text>Status: {channel.status}</Text>
      <TextInput
        onChangeText={setMessageText}
        value={messageText}
        style={{
          backgroundColor: 'white',
          borderColor: 'black',
          color: 'black',
        }}
      />
      <Button
        title="Send message"
        disabled={messageText.length === 0 || channel.status !== 'ready'}
        onPress={() => channel.send(messageText)}
      />
    </SafeAreaView>
  );
};

function useNodejsMobile() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ready'>(
    'loading',
  );

  React.useEffect(() => {
    nodejs.start('loader.js');

    const subscription = nodejs.channel.addListener('start', () => {
      setStatus('ready');
    });

    return () => {
      // @ts-expect-error
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    if (status !== 'ready') return;

    const subscription = nodejs.channel.addListener('message', msg => {
      console.log('RECEIVED MESSAGE', msg);
    });

    return () => {
      // @ts-expect-error
      subscription.remove();
    };
  }, [status]);

  return {
    status,
    send: (msg: string) => {
      if (status !== 'ready') return;
      nodejs.channel.send(msg);
    },
  };
}

export default App;
