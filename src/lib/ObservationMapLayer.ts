import {Observation, Preset} from '@comapeo/schema';
import {validateHTMLColorHex} from 'validate-color';
import {featureCollection as turfFeatureCollection, point} from '@turf/helpers';
import {Feature, Point} from 'geojson';
import {matchPreset} from './utils';
import {CircleLayerSpecification} from '@maplibre/maplibre-react-native';

const DEFAULT_MARKER_COLOR = '#F29D4B';

type CircleColor = NonNullable<
  CircleLayerSpecification['paint']
>['circle-color'];

export function createObservationMapLayerStyle(
  presets: Preset[],
): CircleLayerSpecification['paint'] {
  // Based on example implementation:
  // https://github.com/rnmapbox/maps/blob/0c37ee88bd4b16efac93417a47ab4b474396b318/example/src/examples/SymbolCircleLayer/DataDrivenCircleColors.js

  const categoryColorPairs: Array<[name: string, color: string]> = [];

  for (const {color, name} of presets) {
    // @comapeo/schema only allows hex values for color field
    // https://github.com/digidem/mapeo-schema/blob/f6d93ca456f1059d118dff2d094ceed312fcc2e9/schema/preset/v1.json#L100
    if (color && validateHTMLColorHex(color)) {
      categoryColorPairs.push([name, color]);
    }
  }

  // The style spec's `match` expression requires a fixed-arity tuple, which
  // can't express a variable number of presets - this cast is the one spot
  // where that mismatch is unavoidable.
  const circleColor =
    categoryColorPairs.length > 0
      ? ([
          'match',
          ['get', 'presetName'],
          ...categoryColorPairs.flat(),
          DEFAULT_MARKER_COLOR,
        ] as unknown as CircleColor)
      : DEFAULT_MARKER_COLOR;

  return {
    'circle-color': circleColor,
    'circle-radius': 5,
    'circle-stroke-color': '#fff',
    'circle-stroke-width': 2,
  };
}

export function observationsToFeatureCollection(
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

  return turfFeatureCollection(displayablePoints);
}
