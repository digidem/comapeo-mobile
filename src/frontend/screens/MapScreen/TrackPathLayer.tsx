import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {
  FullLocationData,
  useCurrentTrackStore,
} from '../../hooks/tracks/useCurrentTrackStore';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {LineString} from 'geojson';
export const TrackPathLayer = () => {
  const locationHistory = useCurrentTrackStore(state => state.locationHistory);

  return (
    locationHistory.length > 1 && (
      <ShapeSource
        onPress={() => console.log('display bottom sheet')}
        id="routeSource"
        shape={toRoute(locationHistory)}>
        <LineLayer
          id="routeFill"
          belowLayerID="circles"
          style={styles.lineLayer}
        />
      </ShapeSource>
    )
  );
};

const toRoute = (locations: FullLocationData[]): LineString => {
  return {
    type: 'LineString',
    coordinates: locations.map(location => [
      location.coords.longitude,
      location.coords.latitude,
    ]),
  };
};

const styles = StyleSheet.create({
  lineLayer: {
    lineColor: '#000000',
    lineWidth: 5,
    lineCap: LineJoin.Round,
    lineOpacity: 1.84,
  },
} as any);
