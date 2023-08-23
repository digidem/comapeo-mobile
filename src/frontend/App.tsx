import * as React from 'react';
import nodejs from 'nodejs-mobile-react-native';
import {AppNavigator} from './Navigation/AppNavigator';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {AppStackList} from './Navigation/AppStack';
import {api} from './api';

const App = () => {
  const [messageText, setMessageText] = React.useState('');

  // const [initialNavState, setInitialNavState] = React.useState<
  //   InitialState | "loading" | undefined
  // >("loading");
  const initialNavState = undefined;
  const navRef = useNavigationContainerRef<AppStackList>();

  return (
    <NavigationContainer
      initialState={initialNavState}
      onStateChange={() => {}}
      // linking={{prefixes: [URI_PREFIX]}}
      ref={navRef}>
      <AppNavigator />
    </NavigationContainer>
  //   <Button
  //   title="Send message"
  //   onPress={async () => {
  //     try {
  //       // TODO: I think rpc-reflector is not properly promisifying the method types
  //       const res = await api.observation.getMany();
  //       console.log('rpc call', res);
  //     } catch (e) {
  //       console.log('error sendind rpc', e);
  //     }
  //   }}
  // />
    
  );
};

export default App;
