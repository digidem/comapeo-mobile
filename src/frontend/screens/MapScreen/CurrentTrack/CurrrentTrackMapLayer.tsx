import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {useLocation} from '../../../hooks/useLocation';
import {convertToLineString} from '../../../lib/utils';

export const CurrentTrackMapLayer = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  const isTracking = useTrackState(state => state.isTracking);
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
