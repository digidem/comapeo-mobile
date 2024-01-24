import * as React from 'react';
import {
  AppStackList,
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
import {createDeviceNamingScreens} from './ScreenGroups/DeviceNamingScreens';
import {usePrefetchLastKnownLocation} from '../hooks/useLastSavedLocation';
import {useNavigationContainerRef} from '@react-navigation/native';
import {useProjectInviteListener} from '../hooks/useProjectInviteListener';
import {EDITING_SCREEN_NAMES} from '../constants';
import {useBottomSheetModal} from '../sharedComponents/BottomSheetModal';
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

  const deviceInfo = useDeviceInfo();
  usePrefetchLastKnownLocation();

  const navRef = useNavigationContainerRef<AppStackList>();
  const {isOpen, sheetRef, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  const currentRoute = navRef.isReady()
    ? navRef.getCurrentRoute()?.name
    : undefined;

  const {projectInvites, clearInvite, clearAllInvites} =
    useProjectInviteListener(currentRoute);

  if (projectInvites.length > 0 && !isOpen) {
    openSheet();
  }

  if (permissionAsked && !deviceInfo.isPending) {
    BootSplash.hide();
  }

  // the user should never actually see this because the splash screen is visible, so this is to appease typescript
  if (deviceInfo.isLoading) {
    return <Loading />;
  }

  return (
    <React.Suspense fallback={<Loading />}>
      <RootStack.Navigator
        initialRouteName="IntroToCoMapeo"
        screenOptions={NavigatorScreenOptions}>
        {deviceInfo.data && deviceInfo.data.name
          ? createDefaultScreenGroup(formatMessage)
          : createDeviceNamingScreens(formatMessage)}
      </RootStack.Navigator>

      <ProjectInviteBottomSheet
        isOpen={isOpen}
        sheetRef={sheetRef}
        closeSheet={closeSheet}
        clearInvite={clearInvite}
        invites={projectInvites}
        clearAllInvites={clearAllInvites}
      />
    </React.Suspense>
  );
};
