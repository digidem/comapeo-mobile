import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CameraScreen} from '../../screens/CameraScreen';
import {MapScreen} from '../../screens/MapScreen';
import {ObservationsList} from '../../screens/ObservationsList';
import {HomeHeader} from '../../sharedComponents/HomeHeader';
import {HomeTabsParamsList} from '../../sharedTypes/navigation';
import {TabBar} from './TabBar';
import {SharedLocationContextProvider} from '../../contexts/SharedLocationContext';
import {Loading} from '../../sharedComponents/Loading';
import {WHITE} from '../../lib/styles';

const Tab = createBottomTabNavigator<HomeTabsParamsList>();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
      tabBar={TabBar}
      screenOptions={{
        tabBarShowLabel: false,
        headerTransparent: true,
        header: props => (
          <React.Suspense fallback={null}>
            <HomeHeader
              {...props}
              backgroundColor="transparent"
              showBottomBorder={false}
            />
          </React.Suspense>
        ),
      }}
      initialRouteName={'Map'}
      screenLayout={({children}) => (
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
      )}
      // header needs access the this provider. Layout wraps the entire navigator, while screenLayout wraps each screen (in other words not the header)
      layout={({children}) => (
        <SharedLocationContextProvider>
          {children}
        </SharedLocationContextProvider>
      )}
      backBehavior="initialRoute">
      <Tab.Screen
        name="ObservationsList"
        component={ObservationsList}
        options={{
          headerTransparent: false,
          header: props => (
            <React.Suspense fallback={<Loading />}>
              <HomeHeader {...props} backgroundColor={WHITE} showBottomBorder />
            </React.Suspense>
          ),
        }}
      />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
    </Tab.Navigator>
  );
};
