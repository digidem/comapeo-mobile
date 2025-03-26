import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import * as React from 'react';

import {useTrackState} from '../../contexts/TrackStoreContext';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './CurrentTrack/UserTooltipMarker';

interface UserLocationProps {
  minDisplacement: number;
}

export const UserLocation = ({minDisplacement}: UserLocationProps) => {
  const isTracking = useTrackState(state => state.isTracking);
  const isFocused = useIsFullyFocused();

  return (
    <>
      <MBUserLocation visible={isFocused} minDisplacement={minDisplacement} />
      {isTracking && <UserTooltipMarker />}
    </>
  );
};
