import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';

const App = () => {
  const [messageText, setMessageText] = React.useState('');

  const channel = useNodejsMobile();

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
        onPress={() => channel.send(messageText)}
      />
    </SafeAreaView>
  );
};

function useNodejsMobile() {
  React.useEffect(() => {
    nodejs.start('main.js');

    const subscription = nodejs.channel.addListener('message', msg => {
      console.log('RECEIVED MESSAGE', msg);
    });

    return () => {
      // @ts-expect-error
      subscription.remove();
    };
  }, []);

  return {
    send: (msg: string) => nodejs.channel.send(msg),
  };
}

export default App;
