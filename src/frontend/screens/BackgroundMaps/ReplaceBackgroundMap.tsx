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
} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {toError} from '../../utils/errors';

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
          const error = toError(err, 'Failed to start map download');
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet', {error});
        },
      },
    );
  };

  const handleCancel = () => {
    declineMapShare(
      {shareId, reason: 'user_rejected'},
      {
        onSuccess: () => {
          navigation.popTo('BackgroundMaps');
        },
        onError: (err: unknown) => {
          const error = toError(err, 'Failed to decline map share');
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet', {error});
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
    <View style={styles.container}>
      <View style={styles.content}>
        <IconTitleDescription
          icon={icon}
          title={t(m.replaceMapTitle)}
          description={t(m.replaceMapDescription)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <DestructiveButton
          fullSize
          text={t(m.yesReplace)}
          onPress={handleReplace}
          renderIcon={({color, size}) => (
            <StackSvg width={size * 0.75} height={size * 0.8} color={color} />
          )}
        />
        <SecondaryButton fullSize text={t(m.cancel)} onPress={handleCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
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
  buttonContainer: {
    gap: 12,
    alignItems: 'center',
  },
});
