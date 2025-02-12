import * as React from 'react';

import {useStore} from 'zustand';
import {
  DraftState,
  DraftObservationStore,
} from './PersistedStores/DraftObservationStore.ts';

export function useDraftObservationInstance(): DraftState;
export function useDraftObservationInstance<T>(
  selector: (state: DraftState) => T,
): T;
export function useDraftObservationInstance<T>(
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

export const DraftObservationProvider = DraftObservationContext.Provider;

function useDraftObservationContext() {
  const value = React.useContext(DraftObservationContext);
  if (!value) {
    throw new Error('Must set up the DraftObservationContext first');
  }
  return value;
}
