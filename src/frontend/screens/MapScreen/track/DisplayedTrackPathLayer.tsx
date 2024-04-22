import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {toRoute} from './TrackPathLayer';
import {LocationHistoryPoint} from '../../../sharedTypes/location';

interface DisplayedTrackPathLayer {
  locationHistory: LocationHistoryPoint[];
  onPress: () => void;
}

export const DisplayedTrackPathLayer: FC<DisplayedTrackPathLayer> = ({
  locationHistory,
  onPress,
}) => {
  return (
    <ShapeSource
      onPress={onPress}
      id="routeSource"
      shape={toRoute(locationHistory)}>
      <LineLayer id="routeFill" style={styles.lineLayer} />
    </ShapeSource>
  );
};

const styles = StyleSheet.create({
  lineLayer: {
    lineColor: '#000000',
    lineWidth: 5,
    lineCap: LineJoin.Round,
    lineOpacity: 1.84,
  },
} as any);
