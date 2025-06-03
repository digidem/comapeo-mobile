import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';

import {useLocation} from '../../../hooks/useLocation';
import {convertToLineString} from '../../../lib/utils';
import {useHasActiveTrack} from '../../../hooks/useHasActiveTrack';
import {useTrackState} from '../../../contexts/TrackStoreContext';

export const CurrentTrackMapLayer = () => {
  const hasActiveTrack = useHasActiveTrack();
  const locationHistory = useTrackState(store => store.locationHistory);
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
    hasActiveTrack && (
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
