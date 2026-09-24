import * as React from 'react';
import {StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {useLocationPermission} from '../../../hooks/usePermissions';
import {FullScreenCenteredLoader} from '../../../sharedComponents/FullScreenCenteredLoader';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {
  AllowPermissionButton,
  OpenSettingsButton,
} from '../../../sharedComponents/PermissionButtons';
import {DARK_ORANGE} from '../../../lib/styles';
import HikingIcon from '../../../images/Hiking.svg';

const m = defineMessages({
  title: {
    id: '$1screens.MapScreen.TrackBottomSheet.permissionTitle',
    defaultMessage: 'Record Tracks',
  },
  locationRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationRequired',
    defaultMessage: 'Location required to use.',
  },
});

const ICON_SIZE = 80;

/**
 * For when location was denied and there is no map for the sheet to sit on.
 */
export const TrackPermissionScreen = () => {
  const {formatMessage} = useIntl();
  const location = useLocationPermission();

  if (location.state === 'pending') {
    return <FullScreenCenteredLoader />;
  }

  return (
    <ScreenContentWithDock
      testID="TRACK.permission"
      contentContainerStyle={styles.content}
      dockContent={
        location.state === 'blocked' ? (
          <OpenSettingsButton
            testID="TRACK.permission-settings-btn"
            onPress={location.openSettings}
          />
        ) : (
          <AllowPermissionButton
            testID="TRACK.permission-allow-btn"
            onPress={location.request}
          />
        )
      }>
      <IconTitleDescription
        icon={
          <HikingIcon
            color={DARK_ORANGE}
            width={ICON_SIZE}
            height={ICON_SIZE}
          />
        }
        title={formatMessage(m.title)}
        description={formatMessage(m.locationRequired)}
      />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 80,
  },
});
