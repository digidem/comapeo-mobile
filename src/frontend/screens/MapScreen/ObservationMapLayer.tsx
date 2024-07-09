import React from 'react';
import {Observation, Preset} from '@mapeo/schema';
import MapboxGL from '@rnmapbox/maps';
import {featureCollection, point} from '@turf/helpers';
import {Feature, Point} from 'geojson';
import {validateHTMLColorHex} from 'validate-color';

import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useObservations} from '../../hooks/server/observations';
import {usePresetsQuery} from '../../hooks/server/presets';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {matchPreset} from '../../lib/utils';

const DEFAULT_MARKER_COLOR = '#F29D4B';

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
    const categoryColorPairs: Array<string> = [];

    for (const {color, name} of presets) {
      // @mapeo/schema only allows hex values for color field
      // https://github.com/digidem/mapeo-schema/blob/f6d93ca456f1059d118dff2d094ceed312fcc2e9/schema/preset/v1.json#L100
      if (color && validateHTMLColorHex(color)) {
        categoryColorPairs.push(name, color);
      }
    }

    return {
      circleColor:
        categoryColorPairs.length > 0
          ? [
              'match',
              ['get', 'presetName'],
              ...categoryColorPairs,
              DEFAULT_MARKER_COLOR,
            ]
          : DEFAULT_MARKER_COLOR,
      circleRadius: 5,
      circleStrokeColor: '#fff',
      circleStrokeWidth: 2,
    };
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

function observationsToFeatureCollection(
  observations: Array<Observation>,
  presets: Array<Preset>,
) {
  const displayablePoints: Array<
    Feature<Point, {id: string; categoryId?: string}>
  > = [];

  for (const obs of observations) {
    if (typeof obs.lon === 'number' && typeof obs.lat === 'number') {
      const preset = matchPreset(obs.tags, presets);

      displayablePoints.push(
        point([obs.lon, obs.lat], {
          id: obs.docId,
          presetName: preset?.name,
        }),
      );
    }
  }

  return featureCollection(displayablePoints);
}
