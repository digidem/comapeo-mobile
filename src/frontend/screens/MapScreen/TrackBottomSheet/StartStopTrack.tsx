import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useTrackTimerContext} from '../../../contexts/TrackTimerContext.tsx';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes.ts';
import {useHasActiveTrack} from '../../../hooks/useHasActiveTrack.ts';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {
  DestructiveButton,
  PrimaryButton,
} from '../../../sharedComponents/Buttons.tsx';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText.tsx';
import {useStartLocationUpdates} from '../../../hooks/useStartLocationUpdates.ts';
import * as Sentry from '@sentry/react-native';
import {useStopLocationUpdates} from '../../../hooks/useStopLocationUpdate.ts';
import {
  useTrackActions,
  useTrackState,
} from '../../../contexts/TrackStoreContext.tsx';
import {calculateTotalDistance} from '../../../utils/distance.ts';

const m = defineMessages({
  defaultButtonText: {
    id: 'Modal.GPSEnable.button.default',
    defaultMessage: 'Start Tracks',
  },
  stopButtonText: {
    id: 'Modal.GPSEnable.button.stop',
    defaultMessage: 'Stop Tracks',
  },
  loadingButtonText: {
    id: 'Modal.GPSEnable.button.loading',
    defaultMessage: 'Loading…',
  },
  trackingDescription: {
    id: 'Modal.GPSEnable.trackingDescription',
    defaultMessage: 'You’ve been recording for {time}',
  },
});

export const StartStopTrack = () => {
  const {formatMessage} = useIntl();
  const hasActiveTrack = useHasActiveTrack();
  const {timer} = useTrackTimerContext();
  const navigation = useNavigationFromHomeTabs();
  const startTrack = useStartLocationUpdates();
  const stopTrack = useStopLocationUpdates();
  const {clearCurrentTrack} = useTrackActions();
  const locationHistory = useTrackState(store => store.locationHistory);

  function startTracking() {
    startTrack.mutate(undefined, {
      onError: err => {
        Sentry.captureException(err);
        navigation.navigate('ErrorBottomSheet');
      },
    });
  }

  function endTracking() {
    stopTrack.mutate(undefined, {
      onSuccess: () => {
        const totalDistanceRecorded = calculateTotalDistance({
          points: locationHistory,
          units: 'meters',
        });
        if (totalDistanceRecorded >= 1) {
          navigation.navigate('SaveTrack');
          return;
        }
        clearCurrentTrack();
      },
      onError: err => {
        Sentry.captureException(err);
        navigation.navigate('ErrorBottomSheet');
      },
    });
  }

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      {!hasActiveTrack ? (
        <PrimaryButton
          fullSize={true}
          text={formatMessage(m.defaultButtonText)}
          onPress={startTracking}
          renderIcon={() => <StartTrackingIcon />}
        />
      ) : (
        <DestructiveButton
          text={formatMessage(m.stopButtonText)}
          fullSize={true}
          renderIcon={() => <StopTrackingIcon />}
          onPress={endTracking}
        />
      )}
      {hasActiveTrack && (
        <View style={styles.runtimeWrapper}>
          <View style={styles.indicator} />
          <HeaderText style={{textAlign: 'center'}} variant="header5">
            {formatMessage(m.trackingDescription, {time: timer})}
          </HeaderText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  runtimeWrapper: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  indicator: {
    marginRight: 5,
    height: 10,
    width: 10,
    borderRadius: 99,
    backgroundColor: '#59A553',
  },
});
