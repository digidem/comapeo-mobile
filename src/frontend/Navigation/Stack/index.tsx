import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack/lib/typescript/src/types';
import {WHITE} from '../../lib/styles';
import {AppList, createDefaultScreenGroup} from './AppScreens';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {
  DeviceNamingSceens,
  createDeviceNamingScreens,
} from './DeviceNamingScreens';
import {getInitialRouteName} from '../../utils/navigation';
import {useIntl} from 'react-intl';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {usePresetsQuery} from '../../hooks/server/presets';

export type AppStackList = AppList & DeviceNamingSceens;

export const RootStack = createNativeStackNavigator<AppStackList>();

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};

export const RootStackNavigator = () => {
  const {formatMessage} = useIntl();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );
  const {data: presets} = usePresetsQuery();
  const deviceInfo = useDeviceInfo();

  return (
    <RootStack.Navigator
      initialRouteName={getInitialRouteName({
        hasDeviceName: !!deviceInfo.data?.name,
        existingObservation,
        presets,
      })}
      screenOptions={NavigatorScreenOptions}>
      {deviceInfo.data?.name
        ? createDefaultScreenGroup(formatMessage)
        : createDeviceNamingScreens()}
    </RootStack.Navigator>
  );
};
