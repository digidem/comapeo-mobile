import {type MapeoClientApi} from '@mapeo/ipc';
import {type ObservationValue} from '@mapeo/schema';
import {useAppState} from '@react-native-community/hooks';
import {useEffect} from 'react';
import {Dimensions, Platform} from 'react-native';
import {type StateCreator} from 'zustand';
import packageJson from '../../../package.json';
import {assert} from '../lib/assert';
import noop from '../lib/noop';
import {sleep} from '../lib/sleep';
import {throwIfAborted} from '../lib/throwIfAborted';
import generateMetricsReport from '../metrics/generateMetricsReport';
import {sendMetricsReport} from '../metrics/sendMetricsReport';
import {createPersistedState} from './persistedState/createPersistedState';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const SEND_METRICS_INTERVAL = ONE_DAY;

const getEnv = (name: string): string => {
  const result = process.env[name];
  assert(result, `${name} environment variable should be set`);
  return result;
};

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

const useLastMetricsReportSentAt = createPersistedState(
  lastMetricsReportSentAtSlice,
  'LastMetricsReportSentAt',
);

/**
 * Sleep until we can send metrics again.
 *
 * Throws if aborted.
 */
const sleepUntilWeCanSendMetrics = (
  lastMetricsReportSentAt: null | number,
  options: Readonly<{signal: AbortSignal}>,
): Promise<void> => {
  if (lastMetricsReportSentAt == null) lastMetricsReportSentAt = -Infinity;
  const earliestTimeNextMetricsReportCouldBeSentAt =
    lastMetricsReportSentAt + SEND_METRICS_INTERVAL;
  const waitTime = Math.max(
    0,
    earliestTimeNextMetricsReportCouldBeSentAt - Date.now(),
  );
  return sleep(waitTime, options);
};

const getAllObservations = async (
  api: MapeoClientApi,
): Promise<ObservationValue[]> => {
  const projectSettings = await api.listProjects();
  return (
    await Promise.all(
      projectSettings.map(async ({projectId}) => {
        const project = await api.getProject(projectId);
        return project.observation.getMany();
      }),
    )
  ).flat();
};

export function useSendMetrics(api: MapeoClientApi): void {
  const lastMetricsReportSentAt = useLastMetricsReportSentAt(
    store => store.lastMetricsReportSentAt,
  );
  const setLastMetricsReportSentAt = useLastMetricsReportSentAt(
    store => store.setLastMetricsReportSentAt,
  );

  const isAppActive = useAppState() === 'active';

  useEffect(() => {
    if (!isAppActive) return;

    const abortController = new AbortController();
    const {signal} = abortController;

    (async () => {
      const metricsUrl = getEnv('EXPO_PUBLIC_METRICS_URL');
      const metricsApiKey = getEnv('EXPO_PUBLIC_METRICS_API_KEY');

      await sleepUntilWeCanSendMetrics(lastMetricsReportSentAt, {signal});

      const metricsReport = generateMetricsReport({
        packageJson,
        os: Platform.OS,
        osVersion: Platform.Version,
        screen: Dimensions.get('screen'),
        observations: await getAllObservations(api),
      });

      throwIfAborted(signal);

      // We do everything other than actually send the request in dev to be as
      // realistic as possible without sending bogus data to the server.
      if (!__DEV__) {
        await sendMetricsReport({
          metricsUrl,
          metricsApiKey,
          metricsReport,
          signal,
        });
      }

      setLastMetricsReportSentAt(Date.now());
    })().catch(noop);

    return () => {
      abortController.abort();
    };
  }, [isAppActive, lastMetricsReportSentAt, setLastMetricsReportSentAt, api]);
}
