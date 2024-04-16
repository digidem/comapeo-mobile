import {Observation} from '@mapeo/schema';
import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {useAllObservations} from '../../hooks/useAllObservations';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {OnPressEvent} from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import {useCurrentTrackStore} from '../../hooks/tracks/useCurrentTrackStore';

const DEFAULT_MARKER_COLOR = '#F29D4B';

const layerStyles = {
  circleColor: DEFAULT_MARKER_COLOR,
  circleRadius: 5,
  circleStrokeColor: '#fff',
  circleStrokeWidth: 2,
};

export const ObservationMapLayer = () => {
  const observations = useAllObservations();
  const {navigate} = useNavigationFromHomeTabs();
  const isTracking = useCurrentTrackStore(state => state.isTracking);
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: mapObservationsToFeatures(observations),
  };

  function handlePressEvent(event: OnPressEvent) {
    const properties = event.features[0]?.properties;
    if (!properties) return;
    if (!('id' in properties)) return;

    navigate('Observation', {observationId: properties.id});
  }

  return (
    <MapboxGL.ShapeSource
      onPress={handlePressEvent}
      id="observations-source"
      shape={featureCollection}>
      <MapboxGL.CircleLayer
        aboveLayerID={isTracking ? 'routeFill' : undefined}
        id="circles"
        style={layerStyles}
      />
    </MapboxGL.ShapeSource>
  );
};

function mapObservationsToFeatures(
  observations: Observation[],
): GeoJSON.Feature[] {
  const accDefault: GeoJSON.Feature[] = [];
  const features: GeoJSON.Feature[] = observations.reduce((acc, obs) => {
    if (typeof obs.lon === 'number' && typeof obs.lat === 'number') {
      return [
        ...acc,
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [obs.lon, obs.lat],
          },
          properties: {
            id: obs.docId,
          },
        },
      ];
    }
    return acc;
  }, accDefault);

  return features;
}
