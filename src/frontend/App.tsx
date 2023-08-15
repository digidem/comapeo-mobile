import * as React from 'react';
import {SafeAreaView, Button, TextInput} from 'react-native';
import {Loading} from './components/Loading';
import {api} from './api';

const App = () => {
  const [messageText, setMessageText] = React.useState('');

  return (
    <Loading>
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
              // TODO: I think rpc-reflector is not properly promisifying the method types
              const res = await api.observation.getMany();
              console.log('rpc call', res);
            } catch (e) {
              console.log('error sendind rpc', e);
            }
          }}
        />
      </SafeAreaView>
    </Loading>
  );
};

export default App;
