import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {SafeAreaView, Button, TextInput, Text} from 'react-native';
import {IntlProvider} from './contexts/IntlContext';
import {FormattedMessage, defineMessages} from 'react-intl';

const m = defineMessages({
  test: {
    id: 'test',
    defaultMessage: 'This is a message Descriptor',
  },
});

const App = () => {
  const [messageText, setMessageText] = React.useState('');
  const channel = useNodejsMobile();

  return (
    <IntlProvider>
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <Text>
          <FormattedMessage {...m.test} />
        </Text>
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
