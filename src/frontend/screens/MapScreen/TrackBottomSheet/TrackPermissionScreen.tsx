import * as React from 'react';
import {StyleSheet} from 'react-native';
import {useIntl} from 'react-intl';

import {useTrackPermissionRequest} from './useTrackPermissionRequest';
import {FullScreenCenteredLoader} from '../../../sharedComponents/FullScreenCenteredLoader';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {
  AllowPermissionButton,
  OpenSettingsButton,
} from '../../../sharedComponents/PermissionButtons';
import {DARK_ORANGE} from '../../../lib/styles';
import HikingIcon from '../../../images/Hiking.svg';
import NotificationsUnreadIcon from '../../../images/NotificationsUnread.svg';

const ICON_SIZE = 80;

/**
 * For when location was denied and there is no map for the sheet to sit on.
 */
export const TrackPermissionScreen = () => {
  const {formatMessage} = useIntl();
  const request = useTrackPermissionRequest({enabled: true});

  // Only rendered when location isn't granted, so 'granted' can't come back
  // here — both non-'needed' cases are just "nothing to show yet".
  if (request.status !== 'needed') {
    return <FullScreenCenteredLoader />;
  }

  const Icon = request.icon === 'hiking' ? HikingIcon : NotificationsUnreadIcon;

  return (
    <ScreenContentWithDock
      testID="TRACK.permission"
      contentContainerStyle={styles.content}
      dockContent={
        request.canAsk ? (
          <AllowPermissionButton
            testID="TRACK.permission-allow-btn"
            onPress={request.allow}
          />
        ) : (
          <OpenSettingsButton
            testID="TRACK.permission-settings-btn"
            onPress={request.openSettings}
          />
        )
      }>
      <IconTitleDescription
        icon={<Icon color={DARK_ORANGE} width={ICON_SIZE} height={ICON_SIZE} />}
        title={formatMessage(request.title)}
        description={formatMessage(request.description)}
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
