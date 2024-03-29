import * as React from 'react';
import {
  NavigatorScreenOptions,
  RootStack,
  createDefaultScreenGroup,
  // createOnboardingScreenGroup,
} from './AppStack';
import {useIntl} from 'react-intl';
// import {SecurityContext} from '../context/SecurityContext';

import BootSplash from 'react-native-bootsplash';
import {useDeviceInfo} from '../hooks/server/deviceInfo';
import {Loading} from '../sharedComponents/Loading';
import {
  DeviceNamingSceens,
  createDeviceNamingScreens,
} from './ScreenGroups/DeviceNamingScreens';
import {usePrefetchLastKnownLocation} from '../hooks/useLastSavedLocation';
import {usePersistedDraftObservation} from '../hooks/persistedState/usePersistedDraftObservation';
import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation, Preset} from '@mapeo/schema';
import {matchPreset} from '../lib/utils';
import {AppList} from './ScreenGroups/AppScreens';
import {usePresetsQuery} from '../hooks/server/presets';
import {initializeInviteListener} from '../initializeInviteListener';
import {ProjectInviteBottomSheet} from '../sharedComponents/ProjectInviteBottomSheet';

// import {devExperiments} from '../lib/DevExperiments';

// React Navigation expects children of the Navigator to be a `Screen`, `Group`
// or `React.Fragment` element type. We want to keep this logic in a separate
// file (so that we can alter included screens at built-time for the ICCA
// variant). If we defined a screen group as a component in a separate file,
// then it would not be of any of these types. Therefore we export screen groups
// as functions that create React Elements (_not_ components), and pass them as
// children of the Navigator component. Because of this we cannot use any
// runtime props or hooks inside the screen groups definitions.
//
// Note that this does the same things as the strange syntax found in
// https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270
// `{createScreens()}` is equivalent to `{(() => createScreens())()}`
//
// Note that screen groups should have a `key` prop, so that React knows how to
// update them efficiently.

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

function getInitialRouteName(
  initialInfo:
    | {hasDeviceName: false}
    | {
        hasDeviceName: true;
        existingObservation: null | ClientGeneratedObservation | Observation;
        presets: Preset[];
      },
): keyof AppList | keyof DeviceNamingSceens {
  // if user has not set a name, navigate to intro screen where they will be prompted to set a name
  if (!initialInfo.hasDeviceName) {
    return 'IntroToCoMapeo';
  }

  // if no exisiting observation, navigate to home
  if (!initialInfo.existingObservation) {
    return 'Home';
  }

  // if existing observation and no preset match, user has started creating an observation but had not chosen a preset, so navigate to preset chooser
  if (!matchPreset(initialInfo.existingObservation.tags, initialInfo.presets)) {
    return 'PresetChooser';
  }

  // if existing observation and preset match, navigate to observation edit
  return 'ObservationEdit';
}
