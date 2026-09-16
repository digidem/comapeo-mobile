import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {StartStopTrack} from './StartStopTrack';
import {FullScreenCenteredLoader} from '../../../sharedComponents/FullScreenCenteredLoader';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {
  AllowPermissionButton,
  OpenSettingsButton,
} from '../../../sharedComponents/PermissionButtons';
import {DARK_ORANGE} from '../../../lib/styles';
import {
  useLocationPermission,
  useNotificationPermission,
} from '../../../hooks/usePermissions';
import HikingIcon from '../../../images/Hiking.svg';
import NotificationsUnreadIcon from '../../../images/NotificationsUnread.svg';

const m = defineMessages({
  title: {
    id: '$1screens.MapScreen.TrackBottomSheet.permissionTitle',
    defaultMessage: 'Record Tracks',
  },
  locationAndNotificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationAndNotificationsRequired',
    defaultMessage: 'Location & Notifications required to use.',
  },
  locationRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationRequired',
    defaultMessage: 'Location required to use.',
  },
  notificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.notificationsRequired',
    defaultMessage: 'Notifications required to use.',
  },
});

function requiredMessage({
  needsLocation,
  needsNotifications,
}: {
  needsLocation: boolean;
  needsNotifications: boolean;
}) {
  if (needsLocation && needsNotifications) {
    return m.locationAndNotificationsRequired;
  }
  return needsLocation ? m.locationRequired : m.notificationsRequired;
}

export const TrackSheetContent = ({isOpen}: {isOpen: boolean}) => {
  const {formatMessage} = useIntl();
  const location = useLocationPermission({enabled: isOpen});
  const notifications = useNotificationPermission({enabled: isOpen});

  if (location.state === 'pending' || notifications.state === 'pending') {
    return (
      <View style={{minHeight: 200}}>
        <FullScreenCenteredLoader />
      </View>
    );
  }

  if (location.state === 'granted' && notifications.state === 'granted') {
    return <StartStopTrack />;
  }

  const needsLocation = location.state !== 'granted';
  const needsNotifications = notifications.state !== 'granted';
  const Icon = needsLocation ? HikingIcon : NotificationsUnreadIcon;

  async function handleAllow() {
    if (location.state === 'askable') await location.request();
    if (notifications.state === 'askable') await notifications.request();
  }

  const canAsk =
    location.state === 'askable' || notifications.state === 'askable';

  return (
    <View style={styles.permission} testID="TRACK.permission">
      <IconTitleDescription
        icon={<Icon color={DARK_ORANGE} width={80} height={80} />}
        title={formatMessage(m.title)}
        description={formatMessage(
          requiredMessage({needsLocation, needsNotifications}),
        )}
      />
      {canAsk ? (
        <AllowPermissionButton
          testID="TRACK.permission-allow-btn"
          onPress={handleAllow}
        />
      ) : (
        <OpenSettingsButton
          testID="TRACK.permission-settings-btn"
          onPress={location.openSettings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  permission: {
    alignItems: 'center',
    gap: 30,
    paddingVertical: 10,
  },
});
