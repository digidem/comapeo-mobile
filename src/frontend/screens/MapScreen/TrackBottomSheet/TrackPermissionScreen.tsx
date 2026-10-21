import * as React from 'react';
import {StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

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
  locationAndNotificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationAndNotificationsRequired',
    defaultMessage: 'Location & Notifications required to use.',
  },
});

// The hiker fills only part of its viewBox's width, so it needs a bigger box to match the look design specified
const ICON_SIZE = 100;

/**
 * For when location was denied and there is no map for the sheet to sit on.
 * The map screen calculates the permission and passes it down, so the two screens
 * can't disagree about it.
 */
export const TrackPermissionScreen = ({
  missing,
  canAskAgain,
  onAllow,
  onOpenSettings,
}: {
  missing: 'location' | 'locationAndNotifications';
  canAskAgain: boolean;
  onAllow: () => void;
  onOpenSettings: () => void;
}) => {
  const {formatMessage} = useIntl();

  return (
    <ScreenContentWithDock
      testID="TRACK.permission"
      contentContainerStyle={styles.content}
      dockContent={
        canAskAgain ? (
          <AllowPermissionButton
            testID="TRACK.permission-allow-btn"
            onPress={onAllow}
          />
        ) : (
          <OpenSettingsButton
            testID="TRACK.permission-settings-btn"
            onPress={onOpenSettings}
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
        description={formatMessage(
          missing === 'location'
            ? m.locationRequired
            : m.locationAndNotificationsRequired,
        )}
      />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
});
