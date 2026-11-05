import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import StackSvg from '../../images/Stack.svg';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {VERY_LIGHT_GREY, RED, NEW_DARK_GREY} from '../../lib/styles';
import {
  useDeclineReceivedMapShare,
  useDownloadReceivedMapShare,
  getErrorCode,
  MapShareErrorCode,
} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {toError} from '../../utils/errors';
import {ScreenContentWithButtonDockNoHeader} from '../../sharedComponents/ScreenContentWithDock/ScreenContentWithButtonDockNoHeader.tsx';

const m = defineMessages({
  replaceMapTitle: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.replaceMapTitle',
    defaultMessage: 'Replace current background map?',
  },
  replaceMapDescription: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.replaceMapDescription',
    defaultMessage:
      'This device has a background map that will be replaced if you continue.',
  },
  yesReplace: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.yesReplace',
    defaultMessage: 'Yes, Replace',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.ReplaceBackgroundMap.cancel',
    defaultMessage: 'Cancel',
  },
});

export function ReplaceBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'ReplaceBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;
  const {mutate: declineMapShare} = useDeclineReceivedMapShare();
  const {mutate: downloadMapShare} = useDownloadReceivedMapShare();

  const handleReplace = () => {
    downloadMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.replace('ReceivingBackgroundMap', {shareId});
        },
        onError: (err: unknown) => {
          const code = getErrorCode(err);
          if (
            code === MapShareErrorCode.MAP_SHARE_CANCELED ||
            code === MapShareErrorCode.INVALID_STATUS_TRANSITION
          ) {
            navigation.navigate('MapShareCanceledBottomSheet');
            return;
          }
          const error = toError(err, 'Failed to start map download');
          Sentry.captureException(error);
          navigation.replace('BackgroundMapErrorBottomSheet', {
            title: error.message,
            description: error.message,
          });
        },
      },
    );
  };

  const handleCancel = () => {
    declineMapShare(
      {shareId, reason: 'user_rejected'},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: unknown) => {
          const code = getErrorCode(err);
          if (
            code === MapShareErrorCode.MAP_SHARE_CANCELED ||
            code === MapShareErrorCode.INVALID_STATUS_TRANSITION
          ) {
            navigation.goBack();
            return;
          }
          const error = toError(err, 'Failed to decline map share');
          Sentry.captureException(error);
          navigation.replace('BackgroundMapErrorBottomSheet', {
            title: error.message,
            description: error.message,
          });
        },
      },
    );
  };

  const icon = (
    <View>
      <View style={styles.iconBackground}>
        <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
      </View>
      <View style={styles.warningBadge}>
        <MaterialIcon name="error" size={30} color={RED} />
      </View>
    </View>
  );

  return (
    <ScreenContentWithButtonDockNoHeader
      contentContainerStyle={styles.content}
      topButton={
        <DestructiveButton
          fullSize
          text={t(m.yesReplace)}
          onPress={handleReplace}
          renderIcon={({color, size}) => (
            <StackSvg width={size * 0.75} height={size * 0.8} color={color} />
          )}
        />
      }
      bottomButton={
        <SecondaryButton fullSize text={t(m.cancel)} onPress={handleCancel} />
      }>
      <IconTitleDescription
        icon={icon}
        title={t(m.replaceMapTitle)}
        description={t(m.replaceMapDescription)}
      />
    </ScreenContentWithButtonDockNoHeader>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  iconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: VERY_LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
});
