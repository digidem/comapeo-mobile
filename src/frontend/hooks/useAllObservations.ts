import {useMemo} from 'react';

import {useObservationContext} from '../contexts/ObservationsContext';

export function useAllObservations() {
  const {observations} = useObservationContext();

  // We store observations in state as a Map, but the components expect an array
  const observationsArray = useMemo(
    () =>
      Array.from(observations.values()).sort((a, b) =>
        // TODO: move sorting into component
        a.createdAt < b.createdAt ? 1 : -1,
      ),
    [observations],
  );

  return observationsArray;
}
