import * as React from 'react';

import {useStore} from 'zustand';

import {
  DraftState,
  DraftObservationStore,
} from './PersistedStores/DraftObservationStore.ts';
import {createDraftObservationLocationUpdator} from '../lib/createDraftObservationLocationUpdator.ts';

export function useDraftObservationState(): DraftState;
export function useDraftObservationState<T>(
  selector: (state: DraftState) => T,
): T;
export function useDraftObservationState<T>(
  selector?: (state: DraftState) => T,
) {
  const {instance} = useDraftObservationContext();
  return useStore(instance, selector!);
}

export function useDraftObservationActions() {
  const {actions} = useDraftObservationContext();
  return actions;
}

const DraftObservationContext =
  React.createContext<DraftObservationStore | null>(null);

type DraftObservationProviderProps = {
  children: React.ReactNode;
  draftObservationStore: DraftObservationStore;
};

/** `draftObservationStore` should be initialized outside of react life cycle */
// eslint-disable-next-line @eslint-react/no-unstable-context-value -- the actions are stable
export const DraftObservationProvider = ({
  children,
  draftObservationStore,
}: DraftObservationProviderProps) => {
  createDraftObservationLocationUpdator(draftObservationStore);
  return (
    <DraftObservationContext.Provider value={draftObservationStore}>
      {children}
    </DraftObservationContext.Provider>
  );
};

function useDraftObservationContext() {
  const value = React.useContext(DraftObservationContext);

  if (!value) {
    throw new Error('Must set up the DraftObservationContext first');
  }
  return value;
}
