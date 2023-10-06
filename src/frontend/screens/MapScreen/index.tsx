import * as React from 'react';
import debug from 'debug';

import {MapViewMemoized} from './MapViewMemoized';
import {useLocationContext} from '../../contexts/LocationContext';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';

const log = debug('mapeo:MapScreen');

export const MapScreen = () => {
  const {position, provider, savedPosition} = useLocationContext();
  const isFocused = useIsFullyFocused();

  const coords = React.useMemo(() => {
    if (!position?.coords?.latitude) return undefined;
    if (!position?.coords?.longitude) return undefined;

    return [position.coords.longitude, position.coords.latitude];
  }, [position]);

  const savedCoords = React.useMemo(() => {
    if (!savedPosition?.coords?.latitude) return undefined;
    if (!savedPosition?.coords?.longitude) return undefined;

    return [savedPosition.coords.longitude, savedPosition.coords.latitude];
  }, [savedPosition]);

  return (
    <MapViewMemoized
      coords={coords}
      isFocused={isFocused}
      savedCoords={savedCoords}
      locationServiceEnabled={provider && provider.locationServicesEnabled}
    />
  );
};
