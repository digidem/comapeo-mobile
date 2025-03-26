import {LineLayer, ShapeSource} from '@maplibre/maplibre-react-native';
import * as React from 'react';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {convertToLineString} from '../../../lib/utils';
import {useLocationState} from '../../../contexts/LocationContext';
import {
  BASE_TRACK_LINE_STYLE,
  OVERLAY_TRACK_LINE_STYLE,
} from '../../../lib/trackMapStyles';

export const CurrentTrackMapLayer = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  const location = useLocationState(store => store.location);
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
          id="currentTrackBase"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={BASE_TRACK_LINE_STYLE}
        />
        <LineLayer
          id="currentTrackOverlay"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={OVERLAY_TRACK_LINE_STYLE}
        />
      </ShapeSource>
    )
  );
};
