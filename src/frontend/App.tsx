import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {AppNavigator} from './Navigation/AppNavigator';
import {AppStackList} from './Navigation/AppStack';
import {IntlProvider} from './contexts/IntlContext';
import {Loading} from './components/Loading';

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();

  return (
    <IntlProvider>
      <NavigationContainer ref={navRef}>
        <AppNavigator />
      </NavigationContainer>
    </IntlProvider>
  );
};

export default App;
