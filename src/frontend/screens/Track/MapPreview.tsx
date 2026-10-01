import React, {FC} from 'react';
import {StyleSheet} from 'react-native';
import {
  Map,
  Camera,
  GeoJSONSource,
  Layer,
  type LngLatBounds,
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
import {
  SAVED_TRACK_LINE_JOIN,
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
  const {data: styleUrl} = useMapStyleJsonUrl();

  return (
    <Map
      touchZoom={false}
      doubleTapHoldZoom={false}
      doubleTapZoom={false}
      logo={false}
      dragPan={false}
      touchRotate={false}
      compass={false}
      touchPitch={false}
      androidView="texture"
      mapStyle={styleUrl}>
      <Camera
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

  const layerStyles = React.useMemo(() => {
    return createObservationMapLayerStyle(presets);
  }, [presets]);

  return (
    <GeoJSONSource id="observations-source" data={displayedFeatures}>
      <Layer type="circle" id="circles" paint={layerStyles} />
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
        layout={SAVED_TRACK_LINE_JOIN}
        paint={SAVED_TRACK_LINE_PAINT}
      />
    </GeoJSONSource>
  );
}

const MAP_HEIGHT = 250;
// Minimum bound size to ensure sufficient map detail
const MIN_BOUND_SIZE = 0.0003;

const getAdjustedBounds = (
  locationHistory: LocationHistoryPoint[],
): LngLatBounds => {
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;

  locationHistory.forEach(point => {
    west = Math.min(west, point.latitude);
    east = Math.max(east, point.latitude);
    south = Math.min(south, point.longitude);
    north = Math.max(north, point.longitude);
  });

  // Calculate the current bounds size
  const latDiff = east - west;
  const lngDiff = north - south;

  // Adjust bounds if they are too small
  if (latDiff < MIN_BOUND_SIZE) {
    west -= (MIN_BOUND_SIZE - latDiff) / 2;
    east += (MIN_BOUND_SIZE - latDiff) / 2;
  }

  if (lngDiff < MIN_BOUND_SIZE) {
    south -= (MIN_BOUND_SIZE - lngDiff) / 2;
    north += (MIN_BOUND_SIZE - lngDiff) / 2;
  }

  return [west, south, east, north];
};

export const styles = StyleSheet.create({
  map: {
    height: MAP_HEIGHT,
  },
});
