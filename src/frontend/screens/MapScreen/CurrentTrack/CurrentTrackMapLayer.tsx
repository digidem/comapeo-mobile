import {Layer, GeoJSONSource} from '@maplibre/maplibre-react-native';
import * as React from 'react';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {convertToLineString} from '../../../lib/utils';
import {
  BASE_TRACK_LINE_PAINT,
  LINE_LAYOUT_ROUND,
  OVERLAY_TRACK_LINE_PAINT,
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
    <GeoJSONSource
      id="routeSource"
      data={
        // conditionally rendering shape source (aka only rendering it when there are 2 locations cause a race condition between mapbox and react, causing a error to be thrown. Doing it this way avoids that race condition.)
        finalLocationHistory.length >= 2
          ? convertToLineString(finalLocationHistory)
          : {
              type: 'FeatureCollection',
              features: [],
            }
      }>
      <Layer
        type="line"
        id="currentTrackBase"
        // render below maplibre's user location puck
        beforeId="mlrn-user-location-puck-white"
        paint={BASE_TRACK_LINE_PAINT}
        layout={LINE_LAYOUT_ROUND}
      />
      <Layer
        type="line"
        id="currentTrackOverlay"
        beforeId="mlrn-user-location-puck-white"
        paint={OVERLAY_TRACK_LINE_PAINT}
        layout={LINE_LAYOUT_ROUND}
      />
    </GeoJSONSource>
  );
};
