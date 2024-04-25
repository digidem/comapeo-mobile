import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import * as React from 'react';
import {useCurrentTrackStore} from '../../hooks/tracks/useCurrentTrackStore';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './track/UserTooltipMarker';

interface UserLocationProps {
  minDisplacement: number;
}

export const UserLocation = ({minDisplacement}: UserLocationProps) => {
  const isTracking = useCurrentTrackStore(state => state.isTracking);
  const isFocused = useIsFullyFocused();

  return (
    <>
      <MBUserLocation visible={isFocused} minDisplacement={minDisplacement} />
      {isTracking && <UserTooltipMarker />}
    </>
  );
};
