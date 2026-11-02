import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes.ts';
import {useTracking} from '../../../hooks/useTracking.ts';
import StartTrackingIcon from '../../../images/StartTracking.svg';
import StopTrackingIcon from '../../../images/StopTracking.svg';
import {
  DestructiveButton,
  PrimaryButton,
} from '../../../sharedComponents/Buttons.tsx';
import {usePresetsQuery} from '../../../hooks/server/presets';
import {useTrackState} from '../../../contexts/TrackStoreContext.tsx';
import {TrackStatusLabel} from './TrackStatusLabel.tsx';

const m = defineMessages({
  start: {
    id: '$1TrackBottomSheet.StartStopTrack.start',
    defaultMessage: 'Start',
  },
  end: {
    id: '$1TrackBottomSheet.StartStopTrack.end',
    defaultMessage: 'End',
  },
  recording: {
    id: '$1TrackBottomSheet.StartStopTrack.recording',
    defaultMessage: 'Recording…',
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
  const hasSecondPoint = useTrackState(
    store => store.locationHistory.length > 1,
  );

  const trackPresets = React.useMemo(
    () => presets?.filter(p => p.geometry.includes('line')) ?? [],
    [presets],
  );

  async function finishTracking() {
    if (!hasSecondPoint) {
      navigation.navigate('DidNotMoveBottomSheet');
      return;
    }

    navigation.setParams({trackingOpen: false});
    endTracking();

    if (trackPresets.length === 0) {
      navigation.navigate('SaveTrack');
    } else {
      navigation.navigate('TrackCategoryChooser', {trackAction: 'saveNew'});
    }
  }

  return (
    <View style={{alignItems: 'center', flex: 1}}>
      {!isTracking ? (
        <>
          <TrackStatusLabel
            renderIcon={({color, size}) => (
              <MaterialIcons name="emoji-people" size={size} color={color} />
            )}
            text={formatMessage(m.readyToRecord)}
          />
          <PrimaryButton
            testID="TRACK.start-btn"
            fullSize={true}
            text={formatMessage(m.start)}
            onPress={startTracking}
            iconPosition="leftEdge"
            renderIcon={() => <StartTrackingIcon />}
          />
        </>
      ) : (
        <>
          <TrackStatusLabel
            renderIcon={({color, size}) => (
              <MaterialIcons name="directions-walk" size={size} color={color} />
            )}
            text={formatMessage(m.recording)}
          />
          <DestructiveButton
            testID="TRACK.end-btn"
            text={formatMessage(m.end)}
            fullSize={true}
            iconPosition="leftEdge"
            renderIcon={() => <StopTrackingIcon />}
            onPress={finishTracking}
          />
        </>
      )}
    </View>
  );
};
