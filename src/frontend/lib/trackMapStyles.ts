import {LineLayerSpecification} from '@maplibre/maplibre-react-native';
import {BLACK, COMAPEO_BLUE, WHITE} from './styles';

export const BASE_TRACK_LINE_STYLE: LineLayerSpecification['paint'] = {
  'line-color': WHITE,
  'line-width': 6,
};

export const OVERLAY_TRACK_LINE_STYLE: LineLayerSpecification['paint'] = {
  'line-color': COMAPEO_BLUE,
  'line-width': 3,
  'line-dasharray': [2, 2],
};

export const SAVED_TRACK_LINE_PAINT: LineLayerSpecification['paint'] = {
  'line-color': BLACK,
  'line-width': 5,
};

export const LINE_LAYOUT_ROUND: LineLayerSpecification['layout'] = {
  'line-join': 'round',
  'line-cap': 'round',
};
