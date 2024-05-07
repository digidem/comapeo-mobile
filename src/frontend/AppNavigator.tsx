import * as React from 'react';
import {NavigatorScreenOptions, RootStack} from './Navigation/Stack';
import {useIntl} from 'react-intl';

import BootSplash from 'react-native-bootsplash';
import {useDeviceInfo} from './hooks/server/deviceInfo';
import {createDeviceNamingScreens} from './Navigation/Stack/DeviceNamingScreens';
import {usePrefetchLastKnownLocation} from './hooks/useLastSavedLocation';
import {usePersistedDraftObservation} from './hooks/persistedState/usePersistedDraftObservation';
import {usePresetsQuery} from './hooks/server/presets';
import {initializeInviteListener} from './initializeInviteListener';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {getInitialRouteName} from './utils/navigation';
import {createDefaultScreenGroup} from './Navigation/Stack/AppScreens';

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const {formatMessage} = useIntl();
  const existingObservation = usePersistedDraftObservation(
    store => store.value,
  );
  const {data: presets} = usePresetsQuery();
  const deviceInfo = useDeviceInfo();
  usePrefetchLastKnownLocation();
  initializeInviteListener();

  if (permissionAsked && !deviceInfo.isPending) {
    BootSplash.hide();
  }

  return (
    <React.Fragment>
      <RootStack.Navigator
        initialRouteName={getInitialRouteName({
          hasDeviceName: !!deviceInfo.data?.name,
          existingObservation,
          presets,
        })}
        screenOptions={NavigatorScreenOptions}>
        {/*  Note that this does the same things as the strange syntax found in https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270 `{createScreens()}` is equivalent to `{(() => createScreens())()}` Note that screen groups should have a `key` prop, so that React knows how to update them efficiently. */}
        {deviceInfo.data?.name
          ? createDefaultScreenGroup(formatMessage)
          : createDeviceNamingScreens()}
      </RootStack.Navigator>
      <ProjectInviteBottomSheet />
    </React.Fragment>
  );
};
