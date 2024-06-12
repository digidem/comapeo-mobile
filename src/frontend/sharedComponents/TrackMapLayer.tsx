import {LineJoin, LineLayer, ShapeSource, LineLayerStyle} from '@rnmapbox/maps';
import React from 'react';
import {StyleSheet} from 'react-native';
import {LineString} from 'geojson';
import {BLACK} from '../lib/styles';
import {LocationHistoryPoint} from '../sharedTypes/location';

interface TrackMapLayerProps {
  locationHistory: LocationHistoryPoint[];
  onPress?: () => void;
}

export const TrackMapLayer = ({
  locationHistory,
  onPress,
}: TrackMapLayerProps) => {
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
