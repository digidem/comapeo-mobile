import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {
  Camera,
  CircleLayer,
  LineLayer,
  MapView,
  ShapeSource,
} from '@maplibre/maplibre-react-native';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import {convertToLineString} from '../../lib/utils.ts';
import {Observation} from '@comapeo/schema';
import {usePresetsQuery} from '../../hooks/server/presets.ts';
import {
  createObservationMapLayerStyle,
  observationsToFeatureCollection,
} from '../../lib/ObservationMapLayer.ts';
import {useMapStyleJsonUrl} from '../../hooks/server/maps.ts';
import {SAVED_TRACK_LINE_STYLE} from '../../lib/trackMapStyles';
interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
  observations: Observation[];
}

const MAP_PADDING = 25;

export const MapPreview: FC<TrackScreenMapPreview> = ({
  locationHistory,
  observations,
}) => {
  const [swBoundary, neBoundary] = getAdjustedBounds(locationHistory);
  const styleUrlQuery = useMapStyleJsonUrl();

  return (
    <MapView
      style={styles.map}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      compassEnabled={false}
      mapStyle={styleUrlQuery.data}>
      <Camera
        animationMode="moveTo"
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
    </MapView>
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
    <ShapeSource id="observations-source" shape={displayedFeatures}>
      <CircleLayer id="circles" style={layerStyles} />
    </ShapeSource>
  );
}

function TrackMapLayer({
  locationHistory,
}: {
  locationHistory: LocationHistoryPoint[];
}) {
  return (
    <ShapeSource
      id="trackShapeSource"
      shape={convertToLineString(locationHistory)}>
      <LineLayer id="trackLineLayer" style={SAVED_TRACK_LINE_STYLE} />
    </ShapeSource>
  );
}

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
