import {useStore} from 'zustand';

import {useDraftObservationContext} from '../contexts/DraftObservationContext';
import {
  DraftState,
  DraftStatePopulated,
} from '../hooks/persistedState/usePersistedDraftObservationNew';
import {useCallback} from 'react';

function defaultSelector(state: DraftStatePopulated) {
  return state;
}

export function useDraftObservation<S = DraftStatePopulated>(
  selector: (state: DraftStatePopulated) => S = defaultSelector as any,
) {
  const {store} = useDraftObservationContext();

  const assertPopulatedStateSelector = useCallback(
    (state: DraftState) => {
      if (!state.value) {
        throw new Error('No observation to read');
      }
      return selector(state);
    },
    [selector],
  );

  const value = useStore(store, assertPopulatedStateSelector);

  return value;
}

export function useDraftObservationActions() {
  const {actions} = useDraftObservationContext();
  return actions;
}
