import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';
import {initClientApi} from './lib/clientApi';

const clientApi = initClientApi()

const App = () => {
  const [messageText, setMessageText] = React.useState('');
  nodejs.start('loader.js');

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
            const res = await clientApi?.observation.getMany();
            console.log('rpc call', res);
          } catch (e) {
            console.log('error sendind rpc', e);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default App;
