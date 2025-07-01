import {LineLayer, ShapeSource} from '@rnmapbox/maps';
import * as React from 'react';

import {FeatureCollection} from 'geojson';
import {useTracks} from '../../../hooks/server/track';
import {Track} from '@comapeo/schema';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes';
import {SAVED_TRACK_LINE_STYLE} from '../../../lib/trackMapStyles';
export const TracksMapLayer = () => {
  const {data: tracks} = useTracks();
  const {navigate} = useNavigationFromHomeTabs();

  function handlePress(event: OnPressEvent) {
    const properties = event.features[0]?.properties;
    if (!properties || !('id' in properties)) return;

    navigate('Track', {trackId: properties.id});
  }

  return (
    <ShapeSource
      onPress={handlePress}
      id="tracks"
      shape={convertTracksToFeatures(tracks)}>
      <LineLayer id="trackLines" style={SAVED_TRACK_LINE_STYLE} existing />
    </ShapeSource>
  );
};

function convertTracksToFeatures(tracks: Track[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: tracks.map(track => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: track.locations.map(location => [
          location.coords.longitude,
          location.coords.latitude,
        ]),
      },
      properties: {
        timestamps: track.locations.map(location => location.timestamp),
        mocked: track.locations.map(location => location.mocked),
        id: track.docId,
      },
    })),
  };
}
