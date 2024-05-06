import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {MAP_STYLE} from '../MapScreen';
import {PathLayer} from '../MapScreen/path/PathLayer.tsx';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';

interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
}

export const TrackScreenMapPreview: FC<TrackScreenMapPreview> = ({
  locationHistory,
}) => {
  const [swBoundary, neBoundary] = getBounds(locationHistory);
  return (
    <MapboxGL.MapView
      style={styles.map}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      scaleBarEnabled={false}
      styleURL={MAP_STYLE}>
      <MapboxGL.Camera
        animationMode="none"
        zoomLevel={12}
        bounds={{
          ne: neBoundary!,
          sw: swBoundary!,
          paddingTop: 25,
          paddingRight: 25,
          paddingLeft: 25,
          paddingBottom: 25,
        }}
      />
      <PathLayer onPress={() => {}} locationHistory={locationHistory} />
    </MapboxGL.MapView>
  );
};

const MAP_HEIGHT = 250;

const getBounds = (locationHistory: LocationHistoryPoint[]) => {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  locationHistory.forEach(point => {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  });

  return [
    [minLng, minLat], // southWest
    [maxLng, maxLat], // northEast
  ];
};

export const styles = StyleSheet.create({
  map: {
    height: MAP_HEIGHT,
  },
});
