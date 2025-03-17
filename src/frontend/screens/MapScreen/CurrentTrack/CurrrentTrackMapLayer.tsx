import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import {usePersistedTrack} from '../../../hooks/persistedState/usePersistedTrack';
import * as React from 'react';
import {convertToLineString} from '../../../lib/utils';

export const CurrentTrackMapLayer = () => {
  const locationHistory = usePersistedTrack(state => state.locationHistory);
  const isTracking = usePersistedTrack(state => state.isTracking);

  return (
    locationHistory.length > 1 &&
    isTracking && (
      <ShapeSource
        id="routeSource"
        shape={convertToLineString(locationHistory)}>
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
