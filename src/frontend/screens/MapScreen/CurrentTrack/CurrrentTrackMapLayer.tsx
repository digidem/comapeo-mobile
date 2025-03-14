import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {usePersistedTrack} from '../../../hooks/persistedState/usePersistedTrack';
import * as React from 'react';
import {convertToLineString} from '../../../lib/utils';
import {LocationObject} from 'expo-location';

export const CurrentTrackMapLayer = ({
  location,
}: {
  location: LocationObject | undefined;
}) => {
  const locationHistory = usePersistedTrack(state => state.locationHistory);
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
    locationHistory.length > 1 && (
      <ShapeSource
        id="routeSource"
        shape={convertToLineString(finalLocationHistory)}>
        <LineLayer
          id="currentTrack"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={{
            lineColor: '#000000',
            lineWidth: 5,
            lineCap: LineJoin.Round,
            lineOpacity: 1.84,
          }}
          existing
        />
      </ShapeSource>
    )
  );
};
