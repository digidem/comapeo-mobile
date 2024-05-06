import {LineJoin, LineLayer, ShapeSource, LineLayerStyle} from '@rnmapbox/maps';
import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {LocationHistoryPoint} from '../../../sharedTypes/location';
import {BLACK} from '../../../lib/styles';
import {LineString} from 'geojson';

interface PathLayer {
  locationHistory: LocationHistoryPoint[];
  onPress?: () => void;
}

export const PathLayer: FC<PathLayer> = ({locationHistory, onPress}) => {
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
    lineColor: BLACK,
    lineWidth: 5,
    lineCap: LineJoin.Round,
    lineOpacity: 1.84,
  } as LineLayerStyle,
});

const toRoute = (locations: LocationHistoryPoint[]): LineString => {
  return {
    type: 'LineString',
    coordinates: locations.map(location => [
      location.longitude,
      location.latitude,
    ]),
  };
};
