import * as React from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import {useSendMapShare, useRequestCancelMapShare} from '@comapeo/core-react';
import InviteSent from '../../images/InviteSent.svg';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {TextButton} from '../../sharedComponents/TextButton';

const m = defineMessages({
  waitingMessage: {
    id: 'screens.Settings.MapManagement.WaitingForMapToAccept.waitingMessage',
    defaultMessage: 'Waiting for Device to Accept Map',
  },
  timerMessage: {
    id: 'screens.Settings.MapManagement.WaitingForMapToAccept.timerMessage',
    defaultMessage: 'Map sent {time}s ago',
  },
  cancel: {
    id: 'screens.Settings.MapManagement.WaitingForMapToAccept.cancel',
    defaultMessage: 'Cancel',
  },
});

export function WaitingForMapAccept({
  route,
  navigation,
}: NativeRootNavigationProps<'WaitingForMapAccept'>) {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const {deviceId, mapId} = route.params;

  const [time, setTime] = React.useState(0);
  const sendMapShareMutation = useSendMapShare({projectId});
  const requestCancelMapShareMutation = useRequestCancelMapShare({projectId});
  const hasSentMapShareRef = React.useRef(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({headerShown: false});
  }, [navigation]);

  usePreventAndroidBackButton();

  const cancelShare = React.useCallback(() => {
    if (requestCancelMapShareMutation.status === 'error') {
      navigation.goBack();
      return;
    }

    // TODO: Replace with real shareId once we track it from the send operation
    const TEMP_FAKE_SHARE_ID = 'fake-share-id-for-testing';

    requestCancelMapShareMutation.mutate(
      {shareId: TEMP_FAKE_SHARE_ID},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }, [navigation, requestCancelMapShareMutation]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        cancelShare();
      }
    });

    return () => subscription.remove();
  }, [cancelShare]);

  React.useEffect(() => {
    if (sendMapShareMutation.status === 'error') return;

    if (hasSentMapShareRef.current) return;

    hasSentMapShareRef.current = true;

    sendMapShareMutation.mutate(
      {deviceId, mapId},
      {
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
        onSuccess: (
          result:
            | {decision: 'ACCEPT' | 'UNRECOGNIZED'; shareId: string}
            | {
                decision: 'REJECT';
                shareId: string;
                reason:
                  | 'ALREADY'
                  | 'UNRECOGNIZED'
                  | 'DISK_SPACE'
                  | 'USER_REJECTED';
              },
        ) => {
          if (result.decision === 'ACCEPT') {
            navigation.replace('SendingMap', {shareId: result.shareId});
          } else if (result.decision === 'REJECT') {
            // Navigate to decline screen with reason
            // navigation.navigate('MapDeclineScreen', {reason: result.reason});
          } else {
            // UNRECOGNIZED decision - go back to BackgroundMaps?
            navigation.popTo('BackgroundMaps');
          }
        },
      },
    );
  }, [deviceId, mapId, navigation, sendMapShareMutation]);

  React.useEffect(() => {
    const interval = setInterval(() => setTime(prev => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);

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

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 35,
    flex: 1,
  },
});
