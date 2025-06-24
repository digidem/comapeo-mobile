import {LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';

import {useTrackState} from '../../../contexts/TrackStoreContext';
import {convertToLineString} from '../../../lib/utils';
import {useLocationState} from '../../../contexts/LocationContext';
import {getTrackLineStyles} from '../../../lib/trackMapStyles';

export const CurrentTrackMapLayer = () => {
  const locationHistory = useTrackState(state => state.locationHistory);
  const location = useLocationState(store => store.location);
  const {base, overlay} = getTrackLineStyles();
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
          style={base}
          existing
        />
        <LineLayer
          id="currentTrackOverlay"
          belowLayerID="mapboxUserLocationPulseCircle"
          style={overlay}
          existing
        />
      </ShapeSource>
    )
  );
};
