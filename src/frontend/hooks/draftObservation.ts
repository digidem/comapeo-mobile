import {useStore} from 'zustand';

import {useDraftObservationContext} from '../contexts/DraftObservationContext';
import {DraftState} from '../hooks/persistedState/usePersistedDraftObservationNew';

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
