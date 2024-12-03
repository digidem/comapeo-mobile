import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';
import {
  DraftState,
  createDraftObservationStore,
} from '../hooks/persistedState/usePersistedDraftObservationNew';
import {useStore} from 'zustand';

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

function defaultSelector(state: DraftState) {
  return state;
}

export function useDraftObservation<S = DraftState>(
  selector: (state: DraftState) => S = defaultSelector as any,
) {
  const {store} = useDraftObservationContext();
  const draftObservation = useStore(store, selector);
  return draftObservation;
}

export function useDraftObservationActions() {
  const {actions} = useDraftObservationContext();
  return actions;
}
