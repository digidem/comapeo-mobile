import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import {createDraftObservationStore} from '../hooks/persistedState/usePersistedDraftObservationNew';

const DraftObservationContext = createContext<ReturnType<
  typeof createDraftObservationStore
> | null>(null);

export function DraftObservationProvider({children}: PropsWithChildren<{}>) {
  const [value] = useState(() => createDraftObservationStore());

  return (
    <DraftObservationContext.Provider value={value}>
      {children}
    </DraftObservationContext.Provider>
  );
}

export function useDraftObservationContext() {
  const result = useContext(DraftObservationContext);

  if (!result) {
    throw new Error('Must set up the DraftObservationContext Provider first');
  }

  return result;
}
