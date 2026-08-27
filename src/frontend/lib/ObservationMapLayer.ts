import {Observation, Preset} from '@comapeo/schema';
import {validateHTMLColorHex} from 'validate-color';
import {featureCollection as turfFeatureCollection, point} from '@turf/helpers';
import {Feature, Point} from 'geojson';
import {matchPreset} from './utils';
import {LayerProps} from '@maplibre/maplibre-react-native';

const DEFAULT_MARKER_COLOR = '#F29D4B';

export function createObservationMapLayerPaint(
  presets: Preset[],
): Extract<LayerProps, {type: 'circle'}>['paint'] {
  const categoryColorPairs: Array<string> = [];

  for (const {color, name} of presets) {
    // @comapeo/schema only allows hex values for color field
    // https://github.com/digidem/mapeo-schema/blob/f6d93ca456f1059d118dff2d094ceed312fcc2e9/schema/preset/v1.json#L100
    if (color && validateHTMLColorHex(color)) {
      categoryColorPairs.push(name, color);
    }
  }

  return {
    // TO DO: figure out previous logic
    // "circle-color":
    //   categoryColorPairs.length > 0
    //     ? ([
    //         'match',
    //         ['get', 'presetName'],
    //         ...categoryColorPairs,
    //         DEFAULT_MARKER_COLOR,
    //       ] as const)
    //     : DEFAULT_MARKER_COLOR,
    'circle-color': DEFAULT_MARKER_COLOR,
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
