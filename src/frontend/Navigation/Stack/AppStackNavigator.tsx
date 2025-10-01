import * as React from 'react';
import {RootStack} from '.';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {Loading} from '../../sharedComponents/Loading';
import {AppScreens} from './AppScreens';

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  headerBackVisible: false,
};

export const AppStackNavigator = () => {
  return (
    <RootStack.Navigator
      screenLayout={({children}) => {
        return (
          <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
        );
      }}
      screenOptions={NavigatorScreenOptions}>
      {AppScreens()}
    </RootStack.Navigator>
  );
};
