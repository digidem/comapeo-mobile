import {useMemo} from 'react';

import {useObservations} from './server/observations';

export function useAllObservations() {
  const {data: observations} = useObservations();

  const observationsArray = useMemo(
    () =>
      Array.from(observations.values()).sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1,
      ),
    [observations],
  );

  return observationsArray;
}
