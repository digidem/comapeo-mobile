import React from 'react';
import MapboxGL from '@rnmapbox/maps';

import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useObservations} from '../../hooks/server/observations';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {
  createObservationMapLayerStyle,
  observationsToFeatureCollection,
} from '../../lib/ObservationMapLayer.ts';

export const ObservationMapLayer = () => {
  const {data: observations} = useObservations();
  const {navigate} = useNavigationFromHomeTabs();
  const isTracking = usePersistedTrack(state => state.isTracking);

  const {data: presets} = usePresetsQuery();

  const displayedFeatures = React.useMemo(() => {
    return observationsToFeatureCollection(observations, presets);
  }, [observations, presets]);

  // Based on example implementation:
  // https://github.com/rnmapbox/maps/blob/0c37ee88bd4b16efac93417a47ab4b474396b318/example/src/examples/SymbolCircleLayer/DataDrivenCircleColors.js
  const layerStyles = React.useMemo(() => {
    return createObservationMapLayerStyle(presets);
  }, [presets]);

  return (
    <MapboxGL.ShapeSource
      onPress={event => {
        const properties = event.features[0]?.properties;
        if (!properties) return;
        if (!('id' in properties)) return;

        navigate('Observation', {observationId: properties.id});
      }}
      id="observations-source"
      shape={displayedFeatures}>
      <MapboxGL.CircleLayer
        aboveLayerID={isTracking ? 'routeFill' : undefined}
        id="circles"
        style={layerStyles}
      />
    </MapboxGL.ShapeSource>
  );
};
