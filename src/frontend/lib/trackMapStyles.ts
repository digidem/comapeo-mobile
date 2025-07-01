import {LineJoin, LineLayerStyle} from '@rnmapbox/maps';
import {BLACK, COMAPEO_BLUE, WHITE} from './styles';

export const BASE_TRACK_LINE_STYLE: LineLayerStyle = {
  lineColor: WHITE,
  lineWidth: 6,
  lineJoin: LineJoin.Round,
  lineCap: LineJoin.Round,
};

export const OVERLAY_TRACK_LINE_STYLE: LineLayerStyle = {
  lineColor: COMAPEO_BLUE,
  lineWidth: 3,
  lineJoin: LineJoin.Round,
  lineCap: LineJoin.Round,
  lineDasharray: [2, 2],
};

export const SAVED_TRACK_LINE_STYLE: LineLayerStyle = {
  lineColor: BLACK,
  lineWidth: 5,
  lineJoin: LineJoin.Round,
  lineCap: LineJoin.Round,
};
