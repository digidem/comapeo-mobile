import React, {Suspense} from 'react';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import {AppList, createDefaultScreenGroup} from './AppScreens';
import {
  DeviceNamingSceens,
  createDeviceNamingScreens,
} from './DeviceNamingScreens';
import {DrawerScreenProps} from '@react-navigation/drawer';

import {Loading} from '../../sharedComponents/Loading';
import {DrawerScreens} from '../Drawer';
import {useIntl} from 'react-intl';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDeviceInfo} from '../../hooks/server/deviceInfo';
import {usePresetsQuery} from '../../hooks/server/presets';
import {getInitialRouteName} from '../../utils/navigation';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ProjectInviteBottomSheet} from '../../sharedComponents/ProjectInviteBottomSheet';

export type AppStackList = AppList & DeviceNamingSceens;

export const RootStack = createNativeStackNavigator<AppStackList>();

export const RootStackNavigator = ({
  navigation,
}: DrawerScreenProps<DrawerScreens, 'DrawerHome'>) => {
  return (
    // This provider must be inside the drawer. Otherwise it is always rendered on top of the drawer
    <BottomSheetModalProvider>
      <Suspense fallback={<Loading />}>
        <RootStackNavigatorChild openDrawer={navigation.openDrawer} />
        <ProjectInviteBottomSheet />
      </Suspense>
    </BottomSheetModalProvider>
  );
};

const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};

export function RootStackNavigatorChild({
  openDrawer,
}: {
  openDrawer: () => void;
}) {
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
        ? createDefaultScreenGroup({intl: formatMessage, openDrawer})
        : createDeviceNamingScreens()}
    </RootStack.Navigator>
  );
}
