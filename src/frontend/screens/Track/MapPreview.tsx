import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import Mapbox from '@rnmapbox/maps';
import {convertToLineString} from '../../lib/utils.ts';
import {Observation} from '@mapeo/schema';
import {BLACK} from '../../lib/styles.ts';
import {usePresetsQuery} from '../../hooks/server/presets.ts';
import {
  createObservationMapLayerStyle,
  observationsToFeatureCollection,
} from '../../lib/ObservationMapLayer.ts';
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
  const {data: presets} = usePresetsQuery();

  const displayedFeatures = React.useMemo(() => {
    return observationsToFeatureCollection(observations, presets);
  }, [observations, presets]);

  const layerStyles = React.useMemo(() => {
    return createObservationMapLayerStyle(presets);
  }, [presets]);

  return (
    <MapboxGL.ShapeSource id="observations-source" shape={displayedFeatures}>
      <MapboxGL.CircleLayer id="circles" style={layerStyles} />
    </MapboxGL.ShapeSource>
  );
}

function TrackMapLayer({
  locationHistory,
}: {
  locationHistory: LocationHistoryPoint[];
}) {
  return (
    <MapboxGL.ShapeSource
      id="trackShapeSource"
      shape={convertToLineString(locationHistory)}>
      <MapboxGL.LineLayer id="trackLineLayer" style={lineLayer} />
    </MapboxGL.ShapeSource>
  );
}

const lineLayer: MapboxGL.LineLayerStyle = {
  lineColor: BLACK,
  lineWidth: 3,
  lineCap: MapboxGL.LineJoin.Round,
  lineOpacity: 1.84,
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
