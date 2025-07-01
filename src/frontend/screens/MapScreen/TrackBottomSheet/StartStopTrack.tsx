import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes.ts';
import {useTracking} from '../../../hooks/useTracking.ts';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {
  DestructiveButton,
  PrimaryButton,
} from '../../../sharedComponents/Buttons.tsx';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText.tsx';
import {usePresetsQuery} from '../../../hooks/server/presets';
import {useTrackState} from '../../../contexts/TrackStoreContext.tsx';

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
  trackingRequirement: {
    id: 'TrackBottomSheet.StartStopTrack.trackingRequirement',
    defaultMessage: 'Move one meter to see track.',
  },
  readyToRecord: {
    id: 'TrackBottomSheet.StartStopTrack.readyToRecord',
    defaultMessage: 'Ready to record new track?',
  },
});

export const StartStopTrack = () => {
  const {formatMessage} = useIntl();
  const {isTracking, endTracking, startTracking} = useTracking();
  const navigation = useNavigationFromHomeTabs();
  const {data: presets} = usePresetsQuery();
  const distance = useTrackState(store => store.distance);

  const trackPresets = React.useMemo(
    () => presets?.filter(p => p.geometry.includes('line')) ?? [],
    [presets],
  );

  async function finishTracking() {
    const hasMovedEnough = distance > 0.001;

    if (!hasMovedEnough) {
      navigation.navigate('DidNotMoveBottomSheet');
      return;
    }

    endTracking();

    if (trackPresets.length === 0) {
      navigation.navigate('SaveTrack');
    } else {
      navigation.navigate('TrackCategoryChooser');
    }
  }

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      {!isTracking ? (
        <>
          <HeaderText style={styles.aboveButton} variant="header6">
            {formatMessage(m.readyToRecord)}
          </HeaderText>
          <PrimaryButton
            fullSize={true}
            text={formatMessage(m.defaultButtonText)}
            onPress={startTracking}
            renderIcon={() => <StartTrackingIcon />}
          />
        </>
      ) : (
        <>
          <HeaderText style={styles.aboveButton} variant="header6">
            {formatMessage(m.trackingRequirement)}
          </HeaderText>
          <DestructiveButton
            text={formatMessage(m.stopButtonText)}
            fullSize={true}
            renderIcon={() => <StopTrackingIcon />}
            onPress={finishTracking}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aboveButton: {
    textAlign: 'center',
    paddingBottom: 10,
  },
});
