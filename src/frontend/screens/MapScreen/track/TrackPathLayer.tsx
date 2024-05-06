import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {useCurrentTrackStore} from '../../../hooks/tracks/useCurrentTrackStore';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {LineString} from 'geojson';
import {useLocation} from '../../../hooks/useLocation';
import {LocationHistoryPoint} from '../../../sharedTypes/location';

export const TrackPathLayer = () => {
  const locationHistory = useCurrentTrackStore(state => state.locationHistory);
  const isTracking = useCurrentTrackStore(state => state.isTracking);
  const {location} = useLocation({maxDistanceInterval: 3});
  const finalLocationHistory = location?.coords
    ? [
        ...locationHistory,
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: new Date().getTime(),
        },
      ]
    : locationHistory;

  return (
    locationHistory.length > 1 &&
    isTracking && (
      <ShapeSource id="routeSource" shape={toRoute(finalLocationHistory)}>
        <LineLayer
          id="routeFill"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={styles.lineLayer}
        />
      </ShapeSource>
    )
  );
};

const toRoute = (locations: LocationHistoryPoint[]): LineString => {
  return {
    type: 'LineString',
    coordinates: locations.map(location => [
      location.longitude,
      location.latitude,
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
