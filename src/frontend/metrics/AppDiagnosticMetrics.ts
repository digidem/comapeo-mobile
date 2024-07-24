import * as NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import * as Application from 'expo-application';
import {getLastKnownPositionAsync} from 'expo-location';
import {AppState, Platform} from 'react-native';
import {storage} from '../hooks/persistedState/createPersistedState';
import {
  getDeviceLanguageTag,
  usePersistedLocale,
} from '../hooks/persistedState/usePersistedLocale';
import {assert} from '../lib/assert';
import {MINUTE_MS, formatIsoUtc, parseIsoUtc} from '../lib/date';
import {first} from '../lib/first';
import {last} from '../lib/last';
import {maybeJsonParse} from '../lib/maybeJsonParse';
import {OneAtATimeQueue} from '../lib/OneAtATimeQueue';
import {setIfNotNull} from '../lib/setIfNotNull';
import {
  type AppDiagnosticMetricsQueue,
  type AppDiagnosticMetricsReport,
  hasReportForToday,
  truncateReportsByTime,
  updateQueueHighWatermark,
} from './AppDiagnosticMetricsQueue';
import {getMetricsDeviceId} from './getMetricsDeviceId';
import {getMetricsRequestInfo} from './getMetricsRequestInfo';
import {getMonthlyHash} from './getMonthlyHash';
import {positionToCountries} from './positionToCountries';
import {sendMetricsData} from './sendMetricsData';

const STORAGE_KEY = 'AppDiagnosticMetricsQueue';
const CHECK_INTERVAL = 5 * MINUTE_MS;

function loadQueueFromStorage(): AppDiagnosticMetricsQueue {
  const storedString = storage.getString(STORAGE_KEY);
  if (!storedString) return {reports: []};

  const stored = maybeJsonParse(storedString);
  if (!stored) return {reports: []};

  return stored as AppDiagnosticMetricsQueue;
}

async function getCountry(): Promise<undefined | string> {
  const lastKnownPosition = await getLastKnownPositionAsync().catch(() => null);
  if (!lastKnownPosition) return undefined;
  const {latitude, longitude} = lastKnownPosition.coords;
  const countries = positionToCountries(latitude, longitude);
  return first(countries);
}

async function generateAppDiagnosticMetricsData(): Promise<AppDiagnosticMetricsReport> {
  const result: AppDiagnosticMetricsReport = {
    dateGenerated: formatIsoUtc(new Date()),
    os: Platform.OS,
    osVersion: Platform.Version,
    deviceLocale: getDeviceLanguageTag(),
    appLocale: usePersistedLocale.getState().locale,
    country: await getCountry(),
  };

  setIfNotNull(result, 'appId', Application.applicationId);
  setIfNotNull(result, 'appName', Application.applicationName);
  setIfNotNull(
    result,
    'nativeApplicationVersion',
    Application.nativeApplicationVersion,
  );
  setIfNotNull(result, 'nativeBuildVersion', Application.nativeBuildVersion);

  return result;
}

function saveQueueToStorage(queue: Readonly<AppDiagnosticMetricsQueue>): void {
  storage.set(STORAGE_KEY, JSON.stringify(queue));
}

export class AppDiagnosticMetrics {
  #isEnabled = false;
  #isOnline = false;

  #subscriptionCleanupFns: null | (() => void)[] = null;

  #update;
  #updateQueue = new OneAtATimeQueue();

  constructor() {
    this.#update = () => {
      this.#updateQueue.add(() => this.#doUpdate());
    };
  }

  setEnabled(isEnabled: boolean): void {
    this.#isEnabled = isEnabled;

    if (isEnabled) {
      this.#addListenersIfNecessary();
    } else {
      this.#removeListeners();
    }

    this.#update();
  }

  #addListenersIfNecessary(): void {
    if (this.#subscriptionCleanupFns) return;

    const subscriptionCleanupFns: (() => void)[] = [];

    subscriptionCleanupFns.push(
      NetInfo.addEventListener(state => {
        this.#isOnline = Boolean(state.isInternetReachable);
        this.#update();
      }),
    );

    const appStateSubscription = AppState.addEventListener(
      'change',
      this.#update,
    );
    subscriptionCleanupFns.push(() => appStateSubscription.remove());

    // We could be smarter about this. For example, we could set the timer for
    // beginning of the next day. However, timeouts are a bit unreliable (for
    // example, if the app goes into the background), so we just check
    // periodically. This also simplifies the code a bit.
    setInterval(this.#update, CHECK_INTERVAL);

    this.#subscriptionCleanupFns = subscriptionCleanupFns;
  }

  #removeListeners(): void {
    const subscriptionCleanupFns = this.#subscriptionCleanupFns ?? [];
    for (const fn of subscriptionCleanupFns) fn();
  }

  /**
   * Update the queue and send metrics as needed.
   *
   * Should only be run once at a time. See `this.#update` for a queued alternative.
   */
  async #doUpdate(): Promise<void> {
    if (!this.#isEnabled) {
      storage.delete(STORAGE_KEY);
      return;
    }

    let queue = loadQueueFromStorage();

    const now = new Date();

    const numberOfReportsBeforeTruncation = queue.reports.length;
    queue = truncateReportsByTime(queue, now);
    const numberOfReportsAfterTruncation = queue.reports.length;
    let hasChangedQueue =
      numberOfReportsBeforeTruncation !== numberOfReportsAfterTruncation;

    if (!hasReportForToday(queue)) {
      queue = {
        ...queue,
        reports: [...queue.reports, await generateAppDiagnosticMetricsData()],
      };
      hasChangedQueue = true;
    }

    if (hasChangedQueue) saveQueueToStorage(queue);

    const newestReport = last(queue.reports);

    const shouldSendMetrics =
      this.#isEnabled &&
      this.#isOnline &&
      AppState.currentState === 'active' &&
      !!newestReport;
    if (!shouldSendMetrics) return;

    try {
      const newestReportDate = parseIsoUtc(newestReport.dateGenerated);
      assert(newestReportDate, 'Expected report to be generated');

      await sendMetricsData({
        ...getMetricsRequestInfo(),
        dataToSend: {
          type: 'app diagnostics v1',
          monthlyDeviceHash: await getMonthlyHash(
            'app diagnostics',
            getMetricsDeviceId(),
            // We prefer the date from the newest report, not `new Date()`.
            // These will usually be the same, but it's possible for a user to
            // send metrics right at the end of the month which would generate
            // a new monthly hash, letting us track users across months.
            newestReportDate,
          ),
          reports: queue.reports,
        },
      });

      queue = updateQueueHighWatermark(queue);
      saveQueueToStorage(queue);
    } catch (err) {
      Sentry.captureException(err);
    }
  }
}
