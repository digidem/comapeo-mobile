import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import * as React from 'react';

import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './CurrentTrack/UserTooltipMarker';
import {useHasActiveTrack} from '../../hooks/useHasActiveTrack';

interface UserLocationProps {
  minDisplacement: number;
}

export const UserLocation = ({minDisplacement}: UserLocationProps) => {
  const hasActiveTrack = useHasActiveTrack();
  const isFocused = useIsFullyFocused();

  return (
    <>
      <MBUserLocation visible={isFocused} minDisplacement={minDisplacement} />
      {hasActiveTrack && <UserTooltipMarker />}
    </>
  );
};
