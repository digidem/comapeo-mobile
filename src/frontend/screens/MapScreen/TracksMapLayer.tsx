import {LineJoin, LineLayer, ShapeSource, LineLayerStyle} from '@rnmapbox/maps';
import * as React from 'react';
import {StyleSheet} from 'react-native';

import {FeatureCollection} from 'geojson';
import {BLACK} from '../../lib/styles';
import {useTracks} from '../../hooks/server/track';
import {Track} from '@comapeo/schema';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';

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
      <LineLayer id="trackLines" style={styles.lineLayer} existing />
    </ShapeSource>
  );
};

const styles = StyleSheet.create({
  lineLayer: {
    lineColor: BLACK,
    lineWidth: 5,
    lineCap: LineJoin.Round,
    lineOpacity: 1.84,
  } as LineLayerStyle,
});

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
