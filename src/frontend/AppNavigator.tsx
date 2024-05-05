import * as React from 'react';

// import BootSplash from 'react-native-bootsplash';
import {useDeviceInfo} from './hooks/server/deviceInfo';
import {Loading} from './sharedComponents/Loading';
import {usePrefetchLastKnownLocation} from './hooks/useLastSavedLocation';
import {initializeInviteListener} from './initializeInviteListener';
import {ProjectInviteBottomSheet} from './sharedComponents/ProjectInviteBottomSheet';
import {DrawerNavigator} from './Navigation/Drawer';

// Note that this does the same things as the strange syntax found in
// https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270
// `{createScreens()}` is equivalent to `{(() => createScreens())()}`
// Note that screen groups should have a `key` prop, so that React knows how to update them efficiently.

export const AppNavigator = ({permissionAsked}: {permissionAsked: boolean}) => {
  const deviceInfo = useDeviceInfo();
  usePrefetchLastKnownLocation();
  initializeInviteListener();

  // the user should never actually see this because the splash screen is visible, so this is to appease typescript
  if (deviceInfo.isLoading || !permissionAsked) {
    return <Loading />;
  }

  return (
    <React.Fragment>
      <DrawerNavigator permissionAsked={permissionAsked} />
    </React.Fragment>
  );
};
