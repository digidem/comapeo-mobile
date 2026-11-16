import {LayerAnnotation, Layer} from '@maplibre/maplibre-react-native';

import {NEW_DARK_GREY, WHITE} from '../../../lib/styles';

const SOURCE_ID = 'lastKnownLocation';

// Same sizes as MapLibre's user location puck, so only the color changes when a position arrives
const OUTLINE_RADIUS = 9;
const DOT_RADIUS = 6;

export const LastKnownLocationLayer = ({
  coords,
}: {
  coords: [number, number];
}) => {
  return (
    <LayerAnnotation id={SOURCE_ID} lngLat={coords}>
      <Layer
        type="circle"
        id="lastKnownLocationOutline"
        source={SOURCE_ID}
        paint={{'circle-radius': OUTLINE_RADIUS, 'circle-color': WHITE}}
      />
      <Layer
        type="circle"
        id="lastKnownLocationDot"
        source={SOURCE_ID}
        paint={{'circle-radius': DOT_RADIUS, 'circle-color': NEW_DARK_GREY}}
      />
    </LayerAnnotation>
  );
};
