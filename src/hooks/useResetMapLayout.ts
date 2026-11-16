import {useState, useCallback} from 'react';
import type {LayoutChangeEvent} from 'react-native';

/**
 * Measures a container’s onLayout exactly once and stores its dimensions,
 * then increments a key so the Mapbox SurfaceView unmounts/remounts
 * at the right size. Prevents the “tiny map” 0×0 initialization on Android.
 */
export function useResetMapLayout() {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    if (width && height) {
      setDimensions({width, height});
      setMapKey(k => k + 1);
    }
  }, []);

  return {dimensions, mapKey, onLayout};
}
