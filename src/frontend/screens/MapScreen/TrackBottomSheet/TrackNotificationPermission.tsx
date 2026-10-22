import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {
  AllowPermissionButton,
  OpenSettingsButton,
} from '../../../sharedComponents/PermissionButtons';
import NotifiedIcon from '../../../images/Notified.svg';

const m = defineMessages({
  title: {
    id: '$1screens.MapScreen.TrackBottomSheet.permissionTitle',
    defaultMessage: 'Record Tracks',
  },
  notificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.notificationsRequired',
    defaultMessage: 'Notifications required to use.',
  },
});

const ICON_SIZE = 80;

/** Sits in the track sheet over the map, for when only notifications are missing. */
export const TrackNotificationPermission = ({
  canAskAgain,
  onAllow,
  onOpenSettings,
}: {
  canAskAgain: boolean;
  onAllow: () => void;
  onOpenSettings: () => void;
}) => {
  const {formatMessage} = useIntl();

  return (
    <View style={styles.container} testID="TRACK.notification-permission">
      <IconTitleDescription
        icon={<NotifiedIcon width={ICON_SIZE} height={ICON_SIZE} />}
        title={formatMessage(m.title)}
        description={formatMessage(m.notificationsRequired)}
      />
      {canAskAgain ? (
        <AllowPermissionButton
          testID="TRACK.notification-allow-btn"
          onPress={onAllow}
        />
      ) : (
        <OpenSettingsButton
          testID="TRACK.notification-settings-btn"
          onPress={onOpenSettings}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 30,
    paddingVertical: 10,
  },
});
