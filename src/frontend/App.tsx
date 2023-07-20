import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';
import createClient, {ClientApi} from 'rpc-reflector/client';

import {MapeoClient} from '../shared/MapeoClient.js';
import {MessagePortLike} from './MessagePortLike';

const App = () => {
  const [messageText, setMessageText] = React.useState('');
  const clientApi = useNodejsMobile();

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
        onPress={async () => {
          try {
            const res = await clientApi?.greet(messageText);
            console.log('rpc call', res);
          } catch (e) {
            console.log('error sendind rpc', e);
          }
          try {
            const res = await clientApi?.asyncGreet(messageText);
            console.log('async rpc call', res);
          } catch (e) {
            console.log('error sendind async rpc', e);
          }
        }}
      />
    </SafeAreaView>
  );
};

function useNodejsMobile() {
  const [clientApi, setClientApi] =
    React.useState<ClientApi<typeof MapeoClient>>();
  React.useEffect(() => {
    nodejs.start('loader.js');
    const channel = new MessagePortLike(nodejs.channel);
    setClientApi(createClient<typeof MapeoClient>(channel));
    return () => {
      channel.close();
    };
  }, []);
  return clientApi;
}

export default App;
