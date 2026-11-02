import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
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
import {DARK_GREY} from '../../../lib/styles.ts';

const STATUS_ICON_SIZE = 24;

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
          <View style={styles.aboveButton}>
            <MaterialIcons
              name="emoji-people"
              size={STATUS_ICON_SIZE}
              color={DARK_GREY}
            />
            <HeaderText style={styles.status} variant="header6">
              {formatMessage(m.readyToRecord)}
            </HeaderText>
          </View>
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
          <View style={styles.aboveButton}>
            <MaterialIcons
              name="directions-walk"
              size={STATUS_ICON_SIZE}
              color={DARK_GREY}
            />
            <HeaderText style={styles.status} variant="header6">
              {formatMessage(m.recording)}
            </HeaderText>
          </View>
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

const styles = StyleSheet.create({
  aboveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  status: {
    flexShrink: 1,
  },
});
