import React from 'react';
import MapboxGL from '@rnmapbox/maps';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useObservations} from '../../hooks/server/observations';
import {convertObservationsToFeatures} from '../../lib/utils';

const DEFAULT_MARKER_COLOR = '#F29D4B';

const layerStyles = {
  circleColor: DEFAULT_MARKER_COLOR,
  circleRadius: 5,
  circleStrokeColor: '#fff',
  circleStrokeWidth: 2,
};

export const ObservationMapLayer = () => {
  const {data: observations} = useObservations();
  const {navigate} = useNavigationFromHomeTabs();
  const isTracking = usePersistedTrack(state => state.isTracking);
  const featureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: convertObservationsToFeatures(observations),
  };

  return (
    <MapboxGL.ShapeSource
      onPress={event => {
        const properties = event.features[0]?.properties;
        if (!properties) return;
        if (!('id' in properties)) return;

        navigate('Observation', {observationId: properties.id});
      }}
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
