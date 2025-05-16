import Mapbox from '@rnmapbox/maps';
import * as React from 'react';

import {useTrackState} from '../../contexts/TrackStoreContext';
import {UserTooltipMarker} from './CurrentTrack/UserTooltipMarker';
import {useLocationState} from '../../contexts/LocationContext';

export const UserLocation = () => {
  const isTracking = useTrackState(state => state.isTracking);
  const location = useLocationState(state => state.location);
  const lon = location?.coords.longitude;
  const lat = location?.coords.latitude;

  return (
    <>
      {lat !== undefined && lon !== undefined && (
        <Mapbox.ShapeSource
          id="userDotSource"
          shape={{
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [lon, lat],
            },
            properties: {},
          }}>
          <Mapbox.CircleLayer
            id="accuracyRing"
            aboveLayerID="circles"
            style={{
              circleColor: 'rgba(59, 156, 255, 0.15)', // translucent blue
              circleRadius: 15,
            }}
          />

          {/* Inner blue dot */}
          <Mapbox.CircleLayer
            id="userDotCircle"
            aboveLayerID="circles"
            style={{
              circleColor: '#30B6E3',
              circleRadius: 6,
              circleStrokeColor: 'white',
              circleStrokeWidth: 3,
            }}
          />
        </Mapbox.ShapeSource>
      )}
      {isTracking && <UserTooltipMarker />}
    </>
  );
};
