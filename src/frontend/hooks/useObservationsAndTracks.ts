import {useMemo} from 'react';

import {useObservations} from './server/observations';
import {useTracksQuery} from './server/track';

export function useObservationsAndTracks() {
  const {data: observations} = useObservations();
  const {data: tracks} = useTracksQuery();

  return useMemo(
    () =>
      [...observations, ...tracks].sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1,
      ),
    [tracks, observations],
  );
}
