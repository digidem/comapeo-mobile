import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {usePersistedTrack} from '../../../hooks/persistedState/usePersistedTrack';
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {useLocation} from '../../../hooks/useLocation';
import {convertToLineString} from '../../../lib/utils';

export const CurrentTrackMapLayer = () => {
  const locationHistory = usePersistedTrack(state => state.locationHistory);
  const isTracking = usePersistedTrack(state => state.isTracking);
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
      <ShapeSource
        id="routeSource"
        shape={convertToLineString(finalLocationHistory)}>
        <LineLayer
          id="routeFill"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={styles.lineLayer}
        />
      </ShapeSource>
    )
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
