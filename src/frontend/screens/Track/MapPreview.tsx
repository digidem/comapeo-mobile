import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import Mapbox from '@rnmapbox/maps';
import {TrackMapLayer} from '../../sharedComponents/TrackMapLayer.tsx';
import {convertObservationsToFeatures} from '../../lib/utils.ts';
import {Observation} from '@mapeo/schema';
import {BLACK} from '../../lib/styles.ts';
interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
  observations: Observation[];
}

const MAP_STYLE = Mapbox.StyleURL.Outdoors;
const MAP_PADDING = 25;

export const MapPreview: FC<TrackScreenMapPreview> = ({
  locationHistory,
  observations,
}) => {
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
        padding={{
          paddingTop: MAP_PADDING,
          paddingRight: MAP_PADDING,
          paddingLeft: MAP_PADDING,
          paddingBottom: MAP_PADDING,
        }}
        bounds={{
          ne: neBoundary!,
          sw: swBoundary!,
        }}
      />
      <TrackMapLayer locationHistory={locationHistory} />
      <ObservationMapLayer observations={observations} />
    </MapboxGL.MapView>
  );
};

function ObservationMapLayer({observations}: {observations: Observation[]}) {
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: convertObservationsToFeatures(observations),
  };

  return (
    <MapboxGL.ShapeSource id="observations-source" shape={featureCollection}>
      <MapboxGL.CircleLayer id="circles" style={layerStyles} />
    </MapboxGL.ShapeSource>
  );
}

const layerStyles = {
  circleColor: BLACK,
  circleRadius: 5,
  circleStrokeColor: '#fff',
  circleStrokeWidth: 2,
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
