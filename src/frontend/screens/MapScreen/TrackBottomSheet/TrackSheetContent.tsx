import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {useIntl} from 'react-intl';

import {StartStopTrack} from './StartStopTrack';
import {useTrackPermissionRequest} from './useTrackPermissionRequest';
import {FullScreenCenteredLoader} from '../../../sharedComponents/FullScreenCenteredLoader';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {
  AllowPermissionButton,
  OpenSettingsButton,
} from '../../../sharedComponents/PermissionButtons';
import {DARK_ORANGE} from '../../../lib/styles';
import HikingIcon from '../../../images/Hiking.svg';
import NotificationsUnreadIcon from '../../../images/NotificationsUnread.svg';

const ICON_SIZE = 80;

export const TrackSheetContent = ({isOpen}: {isOpen: boolean}) => {
  const {formatMessage} = useIntl();
  const request = useTrackPermissionRequest({enabled: isOpen});

  if (request.status === 'pending') {
    return (
      <View style={{minHeight: 200}}>
        <FullScreenCenteredLoader />
      </View>
    );
  }

  if (request.status === 'granted') {
    return <StartStopTrack />;
  }

  const Icon = request.icon === 'hiking' ? HikingIcon : NotificationsUnreadIcon;

  return (
    <View style={styles.permission} testID="TRACK.permission">
      <IconTitleDescription
        icon={<Icon color={DARK_ORANGE} width={ICON_SIZE} height={ICON_SIZE} />}
        title={formatMessage(request.title)}
        description={formatMessage(request.description)}
      />
      {request.canAsk ? (
        <AllowPermissionButton
          testID="TRACK.permission-allow-btn"
          onPress={request.allow}
        />
      ) : (
        <OpenSettingsButton
          testID="TRACK.permission-settings-btn"
          onPress={request.openSettings}
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
