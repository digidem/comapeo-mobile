import React from 'react';
import {CircleLayer, ShapeSource} from '@maplibre/maplibre-react-native';

import {useObservations} from '../../../hooks/server/observations';
import {usePresetsQuery} from '../../../hooks/server/presets';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes';
import {
  createObservationMapLayerStyle,
  observationsToFeatureCollection,
} from '../../../lib/ObservationMapLayer';

export const ObservationMapLayer = () => {
  const {data: observations} = useObservations();
  const {navigate} = useNavigationFromHomeTabs();

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
    <ShapeSource
      onPress={event => {
        const properties = event.features[0]?.properties;
        if (!properties) return;
        if (!('id' in properties)) return;

        navigate('Observation', {observationId: properties.id});
      }}
      id="observations-source"
      shape={displayedFeatures}>
      <CircleLayer id="circles" style={layerStyles} />
    </ShapeSource>
  );
};
