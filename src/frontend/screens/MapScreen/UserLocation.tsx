import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import * as React from 'react';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './track/UserTooltipMarker';

interface UserLocationProps {
  minDisplacement: number;
}

export const UserLocation = ({minDisplacement}: UserLocationProps) => {
  const isTracking = usePersistedTrack(state => state.isTracking);
  const isFocused = useIsFullyFocused();

  return (
    <>
      <MBUserLocation visible={isFocused} minDisplacement={minDisplacement} />
      {isTracking && <UserTooltipMarker />}
    </>
  );
};
