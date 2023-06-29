import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';
import {createClient} from 'rpc-reflector';
import MessagePortLike from './lib/message-port-like';
import {api} from '../backend/index.js';

const App = () => {
  const [messageText, setMessageText] = React.useState('');

  useNodejsMobile();

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
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
        disabled={messageText.length === 0}
        onPress={() => console.log}
      />
    </SafeAreaView>
  );
};

function useNodejsMobile() {
  React.useEffect(() => {
    nodejs.start('loader.js');
    const subscription = nodejs.channel.addListener('message', m => {
      console.log('message from backend', m);
    });
    const channel = new MessagePortLike();
    const clientApi = createClient<typeof api>(channel);
    channel.start();
    clientApi
      .greet('tomi')
      .then(d => console.log('rpc call', d))
      .catch(e => console.log('rpc error', e));
    return () => {
      // @ts-expect-error
      subscription.remove();
      channel.close();
    };
  }, []);
}

export default App;
