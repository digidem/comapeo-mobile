import {UserLocation as MBUserLocation} from '@rnmapbox/maps';
import {useCurrentTrackStore} from '../../hooks/tracks/useCurrentTrackStore';
import {useIsFullyFocused} from '../../hooks/useIsFullyFocused';
import {UserTooltipMarker} from './track/UserTooltipMarker';

// import {useExperiments} from '../../hooks/useExperiments';
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
