import {LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {convertToLineString} from '../../../lib/utils';
import {
  BASE_TRACK_LINE_STYLE,
  OVERLAY_TRACK_LINE_STYLE,
} from '../../../lib/trackMapStyles';
import {LocationObject} from 'expo-location';

export const CurrentTrackMapLayer = ({
  location,
}: {
  location: LocationObject | undefined;
}) => {
  const locationHistory = useTrackState(state => state.locationHistory);
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
    <ShapeSource
      id="routeSource"
      shape={
        // conditionally rendering shape source (aka only rendering it when there are 2 locations cause a race condition between mapbox and react, causing a error to be thrown. Doing it this way avoids that race condition.)
        finalLocationHistory.length >= 2
          ? convertToLineString(finalLocationHistory)
          : {
              type: 'FeatureCollection',
              features: [],
            }
      }>
      <LineLayer
        id="currentTrackBase"
        belowLayerID="mapboxUserLocationPulseCircle"
        style={BASE_TRACK_LINE_STYLE}
        existing
      />
      <LineLayer
        id="currentTrackOverlay"
        belowLayerID="mapboxUserLocationPulseCircle"
        style={OVERLAY_TRACK_LINE_STYLE}
        existing
      />
    </ShapeSource>
  );
};
