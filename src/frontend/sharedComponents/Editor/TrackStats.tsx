import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTrackState} from '../../contexts/TrackStoreContext';
import SimpleTrackIcon from '../../images/SimpleTrack.svg';
import {millisecondsToHHMMSS} from '../../lib/millisecondsToFormattedTime';
import {BLUE_GREY} from '../../lib/styles';
import {BodyText} from '../Text/BodyText';
import {defineMessages, useIntl} from 'react-intl';

const m = defineMessages({
  kilometers: {
    id: 'TrackStats.kilometers',
    defaultMessage: 'km',
  },
});

export const TrackStats = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  const distance = useTrackState(state => state.distance);
  const {formatMessage} = useIntl();

  let totalMs = 0;
  if (locationHistory.length >= 2) {
    const first = locationHistory[0];
    const last = locationHistory.at(-1);
    totalMs = first && last ? last.timestamp - first.timestamp : 0;
  }

  const totalTime = millisecondsToHHMMSS(totalMs);
  const totalKm = distance.toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.timeBlock}>
        <SimpleTrackIcon width={9} height={12} />
        <BodyText variant="tinyMeta">{totalTime}</BodyText>
      </View>
      <View style={styles.dividerBlock}>
        <View style={styles.divider} />
        <BodyText variant="tinyMeta">
          {totalKm} {formatMessage(m.kilometers)}
        </BodyText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 35,
    gap: 10,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  divider: {
    width: 12,
    height: 0,
    borderColor: BLUE_GREY,
    borderWidth: 0.5,
    transform: [{rotate: '90deg'}],
  },
});
