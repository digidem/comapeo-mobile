import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useTrackTimerContext} from '../../../contexts/TrackTimerContext.tsx';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes.ts';
import {useTracking} from '../../../hooks/useTracking.ts';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {
  DestructiveButton,
  PrimaryButton,
} from '../../../sharedComponents/Buttons.tsx';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText.tsx';

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
  const {isTracking, cancelTrackingAndReturnIfTracksSaved, startTracking} =
    useTracking();
  const {timer} = useTrackTimerContext();
  const navigation = useNavigationFromHomeTabs();

  function endTracking() {
    const hasTracksSaved = cancelTrackingAndReturnIfTracksSaved();

    if (hasTracksSaved) {
      navigation.navigate('SaveTrack');
    }
  }

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      {!isTracking ? (
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
      {isTracking && (
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
