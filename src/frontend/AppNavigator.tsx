import * as React from 'react';
import {NavigatorScreenOptions, RootStack} from './Navigation/Stack';
import {useIntl} from 'react-intl';

import * as SplashScreen from 'expo-splash-screen';
import {DEVICE_INFO_KEY} from './hooks/server/deviceInfo';
import {createDeviceNamingScreens} from './Navigation/Stack/DeviceNamingScreens';
import {usePrefetchLastKnownLocation} from './hooks/useLastSavedLocation';
import {usePersistedDraftObservation} from './hooks/persistedState/usePersistedDraftObservation';
import {usePresetsQuery} from './hooks/server/presets';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {getInitialRouteName} from './utils/navigation';
import {createDefaultScreenGroup} from './Navigation/Stack/AppScreens';
import {useSuspenseQuery} from '@tanstack/react-query';
import {useApi} from './contexts/ApiContext';

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const {formatMessage} = useIntl();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );
  const mapeoApi = useApi();
  const {data: presets} = usePresetsQuery();
  const deviceInfo = useSuspenseQuery({
    queryKey: [DEVICE_INFO_KEY],
    queryFn: async () => {
      return await mapeoApi.getDeviceInfo();
    },
  });
  usePrefetchLastKnownLocation();

  if (permissionAsked) {
    SplashScreen.hideAsync();
  }

  return (
    <React.Fragment>
      <RootStack.Navigator
        initialRouteName={getInitialRouteName({
          hasDeviceName: !!deviceInfo.data.name,
          existingObservation,
          presets,
        })}
        screenOptions={NavigatorScreenOptions}>
        {/*  Note that this does the same things as the strange syntax found in https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270 `{createScreens()}` is equivalent to `{(() => createScreens())()}` Note that screen groups should have a `key` prop, so that React knows how to update them efficiently. */}
        {deviceInfo.data.name
          ? createDefaultScreenGroup(formatMessage)
          : createDeviceNamingScreens()}
      </RootStack.Navigator>
      <ProjectInviteBottomSheet />
    </React.Fragment>
  );
};
