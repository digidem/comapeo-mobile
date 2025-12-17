import * as React from 'react';
import {AppState, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import {useRequestCancelMapShare, useSingleMapShare} from '@comapeo/core-react';
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
  const {shareId} = route.params;

  const [time, setTime] = React.useState(0);
  const {data: mapShare} = useSingleMapShare({shareId});
  const requestCancelMapShareMutation = useRequestCancelMapShare({projectId});

  usePreventAndroidBackButton();

  const cancelShare = React.useCallback(() => {
    if (requestCancelMapShareMutation.status === 'error') {
      navigation.goBack();
      return;
    }

    requestCancelMapShareMutation.mutate(
      {shareId},
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: (err: Error) => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet');
        },
      },
    );
  }, [navigation, requestCancelMapShareMutation, shareId]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'background') {
        cancelShare();
      }
    });

    return () => subscription.remove();
  }, [cancelShare]);

  React.useEffect(() => {
    if (!mapShare) return;

    if (mapShare.state === 'downloading' || mapShare.state === 'completed') {
      // TODO: Navigate to SendingMap screen once that PR is ready
      // navigation.replace('SendingMap', {shareId});
      navigation.popTo('BackgroundMaps');
    } else if (mapShare.state === 'rejected') {
      // Navigate to MapDeclineScreen to show the reason for rejection,
      // but I currently don't have access to the reason without the result of useSendMapShare
      // navigation.navigate('MapDeclineScreen', {reason: mapShare.result.reason});
      navigation.popTo('BackgroundMaps');
    } else if (mapShare.state === 'cancelled') {
      navigation.popTo('BackgroundMaps');
    } else if (mapShare.state === 'error') {
      Sentry.captureException(new Error('Map share failed'));
      navigation.replace('ErrorBottomSheet');
    }
  }, [mapShare, navigation]);

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
