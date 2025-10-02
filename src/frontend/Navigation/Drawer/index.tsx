import * as React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from '../DrawerContent';
import {RootStack} from '../Stack';
import {createAppScreens} from '../Stack/AppScreens';
import {Loading} from '../../sharedComponents/Loading';
import {useIntl} from 'react-intl';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';

const Drawer = createDrawerNavigator();

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerTitleStyle: {fontFamily: 'Rubik_500Medium'},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  headerBackVisible: false,
};

export const DrawerNavigator = () => {
  const {formatMessage: intl} = useIntl();

  return (
    <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="AppStack" options={{headerShown: false}}>
        {() => (
          <RootStack.Navigator
            screenLayout={({children}) => {
              return (
                <React.Suspense fallback={<Loading />}>
                  {children}
                </React.Suspense>
              );
            }}
            screenOptions={NavigatorScreenOptions}>
            {createAppScreens({intl})}
          </RootStack.Navigator>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};
