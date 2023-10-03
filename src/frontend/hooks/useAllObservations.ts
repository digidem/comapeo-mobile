import {useMemo} from 'react';

import {useObservationContext} from '../contexts/ObservationsContext';

export function useAllObservations() {
  const {observations} = useObservationContext();

  const observationsArray = useMemo(
    () =>
      Array.from(observations.values()).sort((a, b) =>
        a.createdAt < b.createdAt ? 1 : -1,
      ),
    [observations],
  );

  return observationsArray;
}
