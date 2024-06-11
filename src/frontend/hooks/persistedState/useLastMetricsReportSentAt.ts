import {type StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';

type LastMetricsReportSentAtSlice = {
  lastMetricsReportSentAt: null | number;
  setLastMetricsReportSentAt: (lastMetricsReportSentAt: number) => void;
};

const lastMetricsReportSentAtSlice: StateCreator<
  LastMetricsReportSentAtSlice
> = set => ({
  lastMetricsReportSentAt: null,
  setLastMetricsReportSentAt: lastMetricsReportSentAt =>
    set({lastMetricsReportSentAt}),
});

export const useLastMetricsReportSentAt = createPersistedState(
  lastMetricsReportSentAtSlice,
  'LastMetricsReportSentAt',
);
