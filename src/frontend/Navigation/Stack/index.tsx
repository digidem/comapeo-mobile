import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack/lib/typescript/src/types';
import {WHITE} from '../../lib/styles';
import {CustomHeaderLeft} from '../../sharedComponents/CustomHeaderLeft';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {DrawerScreens} from '../Drawer';
import {useIntl} from 'react-intl';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {DEVICE_INFO_KEY} from '../../hooks/server/deviceInfo';
import {usePresetsQuery} from '../../hooks/server/presets';
import {getInitialRouteName} from '../../utils/navigation';
import {createDefaultScreenGroup} from './AppScreens';
import {createDeviceNamingScreens} from './DeviceNamingScreens';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useApi} from '../../contexts/ApiContext';
import {Loading} from '../../sharedComponents/Loading';

export const RootStack = createNativeStackNavigator<AppStackParamsList>();

export function RootStackNavigator({
  navigation,
}: DrawerScreenProps<DrawerScreens, 'DrawerHome'>) {
  return (
    <React.Suspense fallback={<Loading />}>
      <RootStackNavigatorChild openDrawer={navigation.openDrawer} />
    </React.Suspense>
  );
}

function RootStackNavigatorChild({openDrawer}: {openDrawer: () => void}) {
  const {formatMessage} = useIntl();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );
  const {data: presets} = usePresetsQuery();
  const mapeoApi = useApi();

  const deviceInfo = useSuspenseQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });

  return (
    <RootStack.Navigator
      initialRouteName={getInitialRouteName({
        hasDeviceName: !!deviceInfo.data.name,
        existingObservation,
        presets,
      })}
      screenOptions={NavigatorScreenOptions}>
      {deviceInfo.data?.name
        ? createDefaultScreenGroup({
            intl: formatMessage,
            openDrawer: openDrawer,
          })
        : createDeviceNamingScreens()}
    </RootStack.Navigator>
  );
}

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: 'card',
  contentStyle: {backgroundColor: WHITE},
  headerStyle: {backgroundColor: WHITE},
  headerLeft: props => <CustomHeaderLeft headerBackButtonProps={props} />,
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};
