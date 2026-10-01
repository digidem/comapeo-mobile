import {
  LineLayerSpecification,
  LineLayerStyle,
} from '@maplibre/maplibre-react-native';
import {BLACK, COMAPEO_BLUE, WHITE} from './styles';

export const BASE_TRACK_LINE_STYLE: LineLayerStyle = {
  lineColor: WHITE,
  lineWidth: 6,
  lineJoin: 'round',
  lineCap: 'round',
};

export const OVERLAY_TRACK_LINE_STYLE: LineLayerStyle = {
  lineColor: COMAPEO_BLUE,
  lineWidth: 3,
  lineJoin: 'round',
  lineCap: 'round',
  lineDasharray: [2, 2],
};

export const SAVED_TRACK_LINE_PAINT: LineLayerSpecification['paint'] = {
  'line-color': BLACK,
  'line-width': 5,
};

export const SAVED_TRACK_LINE_JOIN: LineLayerSpecification['layout'] = {
  'line-join': 'round',
  'line-cap': 'round',
};
