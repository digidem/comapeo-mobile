import * as React from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {AppNavigator} from './Navigation/AppNavigator';
import {AppStackList} from './Navigation/AppStack';
import {IntlProvider} from './contexts/IntlContext';
// import {Loading} from './components/Loading';
import {lockAsync, OrientationLock} from 'expo-screen-orientation';

const App = () => {
  const navRef = useNavigationContainerRef<AppStackList>();

  // in Mapeo this was done in android file, but can now be done using this relatively small expo module
  React.useLayoutEffect(() => {
    async function lockScreenToPortrait() {
      await lockAsync(OrientationLock.PORTRAIT);
    }

    lockScreenToPortrait();
  }, [lockAsync]);

  return (
    <IntlProvider>
      <NavigationContainer ref={navRef}>
        <AppNavigator />
      </NavigationContainer>
    </IntlProvider>
  );
};

export default App;
