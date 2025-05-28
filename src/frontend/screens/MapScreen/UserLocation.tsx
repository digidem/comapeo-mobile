import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import * as React from 'react';

import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './CurrentTrack/UserTooltipMarker';
import {useCurrentTrackState} from '../../hooks/useTracking';

interface UserLocationProps {
  minDisplacement: number;
}

export const UserLocation = ({minDisplacement}: UserLocationProps) => {
  const {hasActiveTrack} = useCurrentTrackState();
  const isFocused = useIsFullyFocused();

  return (
    <>
      <MBUserLocation visible={isFocused} minDisplacement={minDisplacement} />
      {hasActiveTrack && <UserTooltipMarker />}
    </>
  );
};
