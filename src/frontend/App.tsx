import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput} from 'react-native';

// Initiate the nodejs mobile process
nodejs.start('loader.js');

const App = () => {
  const [messageText, setMessageText] = React.useState('');

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
        onPress={() => nodejs.channel.send(messageText)}
      />
    </SafeAreaView>
  );
};

export default App;
