import {Layer, GeoJSONSource} from '@maplibre/maplibre-react-native';
import * as React from 'react';

import {FeatureCollection} from 'geojson';
import {useTracks} from '../../../hooks/server/track';
import {Track} from '@comapeo/schema';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes';
import {
  LINE_LAYOUT_ROUND,
  SAVED_TRACK_LINE_PAINT,
} from '../../../lib/trackMapStyles';
export const TracksMapLayer = () => {
  const {data: tracks} = useTracks();
  const {navigate} = useNavigationFromHomeTabs();

  return (
    <GeoJSONSource
      onPress={event => {
        const properties = event.nativeEvent.features[0]?.properties;
        if (
          !properties ||
          !('id' in properties) ||
          typeof properties.id !== 'string'
        )
          return;

        navigate('Track', {trackId: properties.id});
      }}
      id="tracks"
      data={convertTracksToFeatures(tracks)}>
      <Layer
        type="line"
        id="trackLines"
        paint={SAVED_TRACK_LINE_PAINT}
        layout={LINE_LAYOUT_ROUND}
      />
    </GeoJSONSource>
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
