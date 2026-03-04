import * as React from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {
  useCancelSentMapShare,
  useSingleSentMapShare,
} from '@comapeo/core-react';
import InviteSent from '../../images/InviteSent.svg';
import StackSvg from '../../images/Stack.svg';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {TextButton} from '../../sharedComponents/TextButton';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {VERY_LIGHT_GREY, RED, NEW_DARK_GREY, BLACK} from '../../lib/styles';
import {toError} from '../../utils/errors';

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
});

export function SendingBackgroundMap({
  route,
  navigation,
}: NativeRootNavigationProps<'SendingBackgroundMap'>) {
  const {formatMessage: t} = useIntl();
  const {shareId} = route.params;

  const [time, setTime] = React.useState(0);
  const mapShare = useSingleSentMapShare({shareId});
  const {mutate: cancelMapShare} = useCancelSentMapShare();

  usePreventAndroidBackButton();

  const cancelShare = React.useCallback(() => {
    cancelMapShare(
      {shareId},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet', {error: err});
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

  React.useEffect(() => {
    if (!mapShare) {
      navigation.popTo('BackgroundMaps');
      return;
    }
    if (mapShare.status === 'aborted') {
      // TODO: Show map cancelled sheet when that exists
      navigation.popTo('BackgroundMaps');
      return;
    }
    if (mapShare.status === 'error') {
      Sentry.captureException(mapShare.error);
      navigation.replace('ErrorBottomSheet', {
        error: toError(mapShare.error, 'Map share failed'),
      });
    }
  }, [mapShare, navigation]);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    navigation.popTo('BackgroundMaps');
  };

  function formatElapsed(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  if (mapShare?.status === 'declined') {
    const reason = (mapShare as {reason?: string}).reason;
    return <MapDeclined reason={reason} onClose={handleClose} />;
  }

  return (
    <View style={styles.container}>
      <InviteSent />
      <HeaderText style={{marginTop: 10, textAlign: 'center'}}>
        {t(m.waitingMessage)}
      </HeaderText>
      <BodyText style={{marginTop: 20}}>
        {t(m.timerMessage, {time: formatElapsed(time)})}
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
  buttonContainer: {
    alignItems: 'center',
  },
});
