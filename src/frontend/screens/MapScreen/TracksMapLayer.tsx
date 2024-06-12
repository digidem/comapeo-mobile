import {LineJoin, LineLayer, ShapeSource, LineLayerStyle} from '@rnmapbox/maps';
import * as React from 'react';
import {StyleSheet} from 'react-native';

import {FeatureCollection} from 'geojson';
import {BLACK} from '../../lib/styles';
import {useTracks} from '../../hooks/server/track';
import {Track} from '@mapeo/schema';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';

export const TracksMapLayer = () => {
  const {data: tracks} = useTracks();

  function handlePress(event: OnPressEvent) {
    const properties = event.features[0]?.properties;
    if (!properties) return;
    if (!('id' in properties)) return;

    // To do navigate to track on press
  }

  return (
    <ShapeSource
      onPress={handlePress}
      id="tracks"
      shape={convertTracksToFeatures(tracks)}>
      <LineLayer id="routeFill" style={styles.lineLayer} />
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
      },
    })),
  };
}
