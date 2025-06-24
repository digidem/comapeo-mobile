import {LineJoin, LineLayerStyle} from '@rnmapbox/maps';
import {COMAPEO_BLUE, WHITE} from './styles';

export const getTrackLineStyles = () => {
  const base: LineLayerStyle = {
    lineColor: WHITE,
    lineWidth: 6,
    lineJoin: LineJoin.Round,
    lineCap: LineJoin.Round,
  };

  const overlay: LineLayerStyle = {
    lineColor: COMAPEO_BLUE,
    lineWidth: 3,
    lineJoin: LineJoin.Round,
    lineCap: LineJoin.Round,
    lineDasharray: [2, 2],
  };

  return {base, overlay};
};
