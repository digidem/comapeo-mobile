import * as React from 'react';
import {AppState, StyleSheet, View, Pressable} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {useKeepAwake} from 'expo-keep-awake';

import {
  useCancelSentMapShare,
  useSingleSentMapShare,
  getErrorCode,
  MapShareErrorCode,
} from '@comapeo/core-react';
import {MapShareCanceled} from '../../sharedComponents/MapShareCanceled';
import {MapShareError} from '../../sharedComponents/MapShareError';
import SendingIcon from '../../images/SendingIcon.svg';
import StackSvg from '../../images/Stack.svg';
import SuccessIcon from '../../images/Success.svg';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {TextButton} from '../../sharedComponents/TextButton';
import {FullScreenCenteredLoader} from '../../sharedComponents/FullScreenCenteredLoader';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {toError} from '../../utils/errors';
import {SendingMapProgressBar} from './SendingMapProgressBar';
import {
  VERY_LIGHT_GREY,
  RED,
  NEW_DARK_GREY,
  BLACK,
  COMAPEO_BLUE,
} from '../../lib/styles';
import {useCurrentTime} from '../../hooks/useCurrentTime';

const m = defineMessages({
  waitingMessage: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.waitingMessage',
    defaultMessage: 'Waiting for Device to Accept Map',
  },
  timerMessage: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.timerMessage',
    defaultMessage: 'Map sent {time}s ago',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.cancel',
    defaultMessage: 'Cancel',
  },
  mapDeclined: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.mapDeclined',
    defaultMessage: 'Map declined.',
  },
  deviceNoSpace: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.deviceNoSpace',
    defaultMessage: 'Device does not have enough space.',
  },
  close: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.close',
    defaultMessage: 'Close',
  },
  sending: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.sending',
    defaultMessage: 'Sending...',
  },
  mapSent: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.mapSent',
    defaultMessage: 'Map sent!',
  },
  done: {
    id: 'screens.Settings.MapManagement.SendingBackgroundMap.done',
    defaultMessage: 'Done',
  },
});

export function SendingBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'SendingBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;

  const mapShare = useSingleSentMapShare({shareId});
  const {mutate: cancelMapShare, status: cancelStatus} =
    useCancelSentMapShare();
  const currentTime = useCurrentTime(1000);
  useKeepAwake();

  usePreventAndroidBackButton();

  const elapsedSeconds = mapShare
    ? Math.floor((currentTime.getTime() - mapShare.mapShareCreatedAt) / 1000)
    : 0;

  const cancelShare = React.useCallback(() => {
    cancelMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: Error) => {
          const code = getErrorCode(err);
          if (
            code === MapShareErrorCode.INVALID_STATUS_TRANSITION ||
            code === MapShareErrorCode.MAP_SHARE_NOT_FOUND
          ) {
            navigation.goBack();
            return;
          }
          Sentry.captureException(err);
          const error = toError(err, 'Failed to cancel map share');
          navigation.replace('BackgroundMapErrorBottomSheet', {
            title: error.message,
            description: error.message,
          });
        },
      },
    );
  }, [navigation, cancelMapShare, shareId]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        cancelShare();
      }
    });
    return () => subscription.remove();
  }, [cancelShare]);

  const handleClose = () => {
    navigation.goBack();
  };

  function formatElapsed(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  if (!mapShare) {
    return null;
  }

  if (mapShare.status === 'aborted') {
    return <MapShareCanceled onClose={handleClose} />;
  }

  if (mapShare.status === 'error') {
    const code = mapShare.error.code;
    if (
      code === MapShareErrorCode.INVALID_STATUS_TRANSITION ||
      code === MapShareErrorCode.MAP_SHARE_NOT_FOUND ||
      code === MapShareErrorCode.MAP_SHARE_CANCELED
    ) {
      return <MapShareCanceled onClose={handleClose} />;
    }
    const error = toError(mapShare.error, 'Map share failed');
    Sentry.captureException(error);
    return (
      <MapShareError
        title={error.message}
        description={error.message}
        onClose={handleClose}
      />
    );
  }

  if (mapShare.status === 'declined') {
    const reason = (mapShare as {reason?: string}).reason;
    return <MapDeclined reason={reason} onClose={handleClose} />;
  }

  if (mapShare.status === 'downloading') {
    return <SendingMap shareId={shareId} onCancel={cancelShare} />;
  }

  if (mapShare.status === 'completed') {
    return <MapSent onDone={handleClose} />;
  }

  if (cancelStatus === 'pending') {
    return <FullScreenCenteredLoader />;
  }

  return (
    <View style={styles.container}>
      <SendingIcon />
      <HeaderText style={{marginTop: 10, textAlign: 'center'}}>
        {t(m.waitingMessage)}
      </HeaderText>
      <BodyText style={{marginTop: 20}}>
        {t(m.timerMessage, {time: formatElapsed(elapsedSeconds)})}
      </BodyText>
      <TextButton title={t(m.cancel)} onPress={cancelShare} />
    </View>
  );
}

function MapDeclined({
  reason,
  onClose,
}: {
  reason?: string;
  onClose: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const isDiskSpaceIssue = reason === 'disk_full';
  const headerText = isDiskSpaceIssue ? t(m.deviceNoSpace) : t(m.mapDeclined);

  return (
    <View style={styles.baseContainer}>
      <View style={styles.centeredContent}>
        <View>
          <View style={styles.iconBackground}>
            <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
          </View>
          <View style={styles.warningBadge}>
            <MaterialIcon name="error" size={30} color={RED} />
          </View>
        </View>

        <HeaderText variant="header2" style={styles.declinedHeaderText}>
          {headerText}
        </HeaderText>
      </View>

      <View style={styles.buttonContainer}>
        <SecondaryButton fullSize text={t(m.close)} onPress={onClose} />
      </View>
    </View>
  );
}

function SendingMap({
  shareId,
  onCancel,
}: {
  shareId: string;
  onCancel: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={[styles.baseContainer, {alignItems: 'center'}]}>
      <View style={styles.sendingTopSection}>
        <View style={styles.iconBackground}>
          <StackSvg width={47} height={50} color={NEW_DARK_GREY} />
        </View>

        <HeaderText variant="header2">{t(m.sending)}</HeaderText>

        <View style={styles.progressContainer}>
          <MaterialIcon
            name="sync"
            size={24}
            color={COMAPEO_BLUE}
            style={styles.syncIcon}
          />
          <SendingMapProgressBar shareId={shareId} />
        </View>
      </View>

      <Pressable onPress={onCancel} style={styles.cancelButton}>
        <HeaderText variant="header4" style={styles.cancelText}>
          {t(m.cancel)}
        </HeaderText>
      </Pressable>
    </View>
  );
}

function MapSent({onDone}: {onDone: () => void}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={[styles.baseContainer, {justifyContent: 'space-between'}]}>
      <IconTitleDescription
        style={styles.sentContent}
        icon={<SuccessIcon />}
        title={t(m.mapSent)}
      />
      <View style={styles.buttonContainer}>
        <SecondaryButton fullSize text={t(m.done)} onPress={onDone} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseContainer: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 35,
  },
  centeredContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
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
  declinedHeaderText: {
    textAlign: 'center',
    color: BLACK,
  },
  sendingTopSection: {
    alignItems: 'center',
    gap: 20,
    marginTop: 120,
  },
  progressContainer: {
    gap: 15,
  },
  syncIcon: {
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 80,
  },
  cancelText: {
    color: COMAPEO_BLUE,
  },
  sentContent: {
    paddingTop: 180,
  },
});
