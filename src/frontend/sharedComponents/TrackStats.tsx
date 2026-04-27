import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import SimpleTrackIcon from '../images/SimpleTrack.svg';
import {millisecondsToHHMMSS} from '../lib/millisecondsToFormattedTime';
import {BLUE_GREY} from '../lib/styles';
import {BodyText} from './Text/BodyText';
import {useUnitSystem} from '../contexts/UnitSystemStoreContext';
import {kmOrConversion} from '../lib/unitConversion';

type TrackStatsProps = {
  distance: number;
  durationMs: number;
  backgroundColor?: string;
  center?: boolean;
};

export const TrackStats = ({
  distance,
  durationMs,
  backgroundColor,
  center = false,
}: TrackStatsProps) => {
  const unitSystem = useUnitSystem();
  const totalTime = millisecondsToHHMMSS(durationMs);
  const {value: displayDistance, unit: distanceUnit} = kmOrConversion(
    distance,
    unitSystem,
  );

  return (
    <View
      style={[
        styles.container,
        center && {justifyContent: 'center'},
        backgroundColor && {backgroundColor},
      ]}>
      <View style={styles.timeBlock}>
        <SimpleTrackIcon width={9} height={12} />
        <BodyText variant="tinyMeta">{totalTime}</BodyText>
      </View>
      <View style={styles.dividerBlock}>
        <View style={styles.divider} />
        <BodyText variant="tinyMeta">
          {displayDistance} {distanceUnit}
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
