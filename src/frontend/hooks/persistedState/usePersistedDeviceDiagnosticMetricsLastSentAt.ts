import type {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

const slice: StateCreator<{
  lastSentAt: null | number;
  setLastSentAt: (lastSentAt: number) => void;
}> = set => ({
  lastSentAt: null,
  setLastSentAt: lastSentAt => set({lastSentAt}),
});

const useSlice = createPersistedState(
  slice,
  'DeviceDiagnosticMetricsLastSentAt',
);

export const usePersistedDeviceDiagnosticMetricsLastSentAt = (): [
  null | number,
  (lastSentAt: number) => void,
] => useSlice(store => [store.lastSentAt, store.setLastSentAt]);
