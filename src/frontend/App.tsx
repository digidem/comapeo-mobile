import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {useClientApi} from './hooks/useClientApi';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient()


const App = () => {
  const [messageText, setMessageText] = React.useState('');
  nodejs.start('loader.js');

  const clientApi = useClientApi();

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </NavigationContainer>
  );
};

export default App;
