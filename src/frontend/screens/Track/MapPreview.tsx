import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import Mapbox from '@rnmapbox/maps';
import {TrackMapLayer} from '../../sharedComponents/TrackMapLayer.tsx';
interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
}

const MAP_STYLE = Mapbox.StyleURL.Outdoors;

export const MapPreview: FC<TrackScreenMapPreview> = ({locationHistory}) => {
  const [swBoundary, neBoundary] = getAdjustedBounds(locationHistory);
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
      <TrackMapLayer locationHistory={locationHistory} />
    </MapboxGL.MapView>
  );
};

const MAP_HEIGHT = 250;
// Minimum bound size to ensure sufficient map detail
const MIN_BOUND_SIZE = 0.0003;

const getAdjustedBounds = (locationHistory: LocationHistoryPoint[]) => {
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

  // Calculate the current bounds size
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;

  // Adjust bounds if they are too small
  if (latDiff < MIN_BOUND_SIZE) {
    minLat -= (MIN_BOUND_SIZE - latDiff) / 2;
    maxLat += (MIN_BOUND_SIZE - latDiff) / 2;
  }

  if (lngDiff < MIN_BOUND_SIZE) {
    minLng -= (MIN_BOUND_SIZE - lngDiff) / 2;
    maxLng += (MIN_BOUND_SIZE - lngDiff) / 2;
  }

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
