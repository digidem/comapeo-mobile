import * as React from 'react';
import {
  NavigatorScreenOptions,
  RootStack,
  createDefaultScreenGroup,
  // createOnboardingScreenGroup,
} from './Navigation/AppStack';
import {useIntl} from 'react-intl';
// import {SecurityContext} from '../context/SecurityContext';

import BootSplash from 'react-native-bootsplash';
import {useDeviceInfo} from './hooks/server/deviceInfo';
import {Loading} from './sharedComponents/Loading';
import {createDeviceNamingScreens} from './Navigation/Stack/DeviceNamingScreens';
import {usePrefetchLastKnownLocation} from './hooks/useLastSavedLocation';
import {usePersistedDraftObservation} from './hooks/persistedState/usePersistedDraftObservation';
import {usePresetsQuery} from './hooks/server/presets';
import {initializeInviteListener} from './initializeInviteListener';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {getInitialRouteName} from './utils/navigation';

// Note that this does the same things as the strange syntax found in
// https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270
// `{createScreens()}` is equivalent to `{(() => createScreens())()}`
// Note that screen groups should have a `key` prop, so that React knows how to update them efficiently.

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

  // the user should never actually see this because the splash screen is visible, so this is to appease typescript
  if (deviceInfo.isLoading) {
    return <Loading />;
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
        {deviceInfo.data?.name
          ? createDefaultScreenGroup(formatMessage)
          : createDeviceNamingScreens()}
      </RootStack.Navigator>
      <ProjectInviteBottomSheet />
    </React.Fragment>
  );
};