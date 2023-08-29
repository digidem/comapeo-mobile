import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {AppNavigator} from './Navigation/AppNavigator';
import {AppStackList} from './Navigation/AppStack';
import {IntlProvider} from './contexts/IntlContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();
  return (
    <IntlProvider>
      <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer ref={navRef}>
          <AppNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </IntlProvider>
  );
};

export default App;
