import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  LngLatBounds,
} from '@maplibre/maplibre-react-native';
import {LocationHistoryPoint} from '../../sharedTypes/location.ts';
import {convertToLineString} from '../../lib/utils.ts';
import {Observation} from '@comapeo/schema';
import {usePresetsQuery} from '../../hooks/server/presets.ts';
import {
  createObservationMapLayerPaint,
  observationsToFeatureCollection,
} from '../../lib/ObservationMapLayer.ts';
import {useMapStyleJsonUrl} from '../../hooks/server/maps.ts';
import {
  SAVED_TRACK_LINE_LAYOUT,
  SAVED_TRACK_LINE_PAINT,
} from '../../lib/trackMapStyles';
interface TrackScreenMapPreview {
  locationHistory: LocationHistoryPoint[];
  observations: Observation[];
}

const MAP_PADDING = 25;

export const MapPreview: FC<TrackScreenMapPreview> = ({
  locationHistory,
  observations,
}) => {
  const bounds = getAdjustedBounds(locationHistory);
  const styleUrlQuery = useMapStyleJsonUrl();

  return (
    <Map
      style={styles.map}
      touchZoom={false}
      doubleTapHoldZoom={false}
      doubleTapZoom={false}
      logo={false}
      dragPan={false}
      touchPitch={false}
      touchRotate={false}
      compass={false}
      mapStyle={styleUrlQuery.data}>
      <Camera
        easing="linear"
        padding={{
          top: MAP_PADDING,
          right: MAP_PADDING,
          left: MAP_PADDING,
          bottom: MAP_PADDING,
        }}
        bounds={bounds}
      />
      <TrackMapLayer locationHistory={locationHistory} />
      <ObservationMapLayer observations={observations} />
    </Map>
  );
};

function ObservationMapLayer({observations}: {observations: Observation[]}) {
  const {data: presets} = usePresetsQuery();

  const displayedFeatures = React.useMemo(() => {
    return observationsToFeatureCollection(observations, presets);
  }, [observations, presets]);

  const layerPaint = React.useMemo(() => {
    return createObservationMapLayerPaint(presets);
  }, [presets]);

  return (
    <GeoJSONSource id="observations-source" data={displayedFeatures}>
      <Layer type="circle" id="circles" paint={layerPaint} />
    </GeoJSONSource>
  );
}

function TrackMapLayer({
  locationHistory,
}: {
  locationHistory: LocationHistoryPoint[];
}) {
  return (
    <GeoJSONSource
      id="trackShapeSource"
      data={convertToLineString(locationHistory)}>
      <Layer
        type="line"
        id="trackLines"
        paint={SAVED_TRACK_LINE_PAINT}
        layout={SAVED_TRACK_LINE_LAYOUT}
      />
    </GeoJSONSource>
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

  return [minLng, minLat, maxLng, maxLat] satisfies LngLatBounds;
};

export const styles = StyleSheet.create({
  map: {
    height: MAP_HEIGHT,
  },
});
