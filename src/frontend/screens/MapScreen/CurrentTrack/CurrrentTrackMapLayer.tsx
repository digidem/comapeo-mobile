import {LineJoin, LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';
import {convertToLineString} from '../../../lib/utils';
import {useTrackState} from '../../../contexts/TrackStoreContext';

export const CurrentTrackMapLayer = () => {
  const locationHistory = useTrackState(state => state.locationHistory);

  return (
    <ShapeSource id="routeSource" shape={convertToLineString(locationHistory)}>
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
  );
};
