import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button} from 'react-native';
import {IntlProvider} from './contexts/IntlContext';

const App = () => {
  const [messageText, setMessageText] = React.useState('');
  const channel = useNodejsMobile();

  return (
    <IntlProvider>
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <Button
          title="Send message"
          onPress={() => channel.send(messageText)}
        />
      </SafeAreaView>
    </IntlProvider>
  );
};

function useNodejsMobile() {
  React.useEffect(() => {
    nodejs.start('loader.js');

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
