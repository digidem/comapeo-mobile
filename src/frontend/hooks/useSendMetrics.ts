import { useEffect, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { useAppState } from "@react-native-community/hooks";
import { createPersistedState } from "./createPersistedState";
import generateMetricsReport from "../metrics/generateMetricsReport.ts";
import { decodeMetricsAuthorization } from "../metrics/metricsAuthorization.ts";
// TODO(evanhahn) organize imports

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const SEND_METRICS_INTERVAL = ONE_DAY;

// TODO(evanhahn) Instead of "sent at", maybe something like "finished at"?
type LastMetricsReportSentAtSlice = {
  lastMetricsReportSentAt: null | number;
  setLastMetricsReportSentAt: (at: number) => void;
};

const lastMetricsReportSentAtSlice: StateCreator<LastMetricsReportSentAtSlice> =
  (set) => ({
    lastMetricsReportSentAt: null,
    setLastMetricsReportSentAt: set,
  });

const useLastMetricsReportSentAt = createPersistedState(
  lastMetricsReportSentAtSlice,
  "LastMetricsReportSentAt",
);

// TODO(evanhahn) move this to a utility
const sleep = (
  ms: number,
  options?: Readonly<{ signal?: AbortSignal }>,
): Promise<void> => {
  const signal = options?.signal;

  if (signal) {
    return new Promise((resolve, reject) => {
      signal.throwIfAborted();

      const timeout = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
      }, ms);

      const onAbort = () => {
        clearTimeout(timeout);
        reject(signal.reason);
        signal.removeEventListener("abort", onAbort);
      };
      signal.addEventListener("abort", onAbort);
    });
  } else {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
};

const sleepUntilWeCanSendMetrics = (
  lastMetricsReportSentAt: null | number,
  options: Readonly<{ signal: AbortSignal }>,
): Promise<void> => {
  if (lastMetricsReportSentAt == null) lastMetricsReportSentAt = -Infinity;
  const earliestTimeNextMetricsReportCouldBeSentAt = lastMetricsReportSentAt +
    SEND_METRICS_INTERVAL;
  const waitTime = Math.max(
    0,
    earliestTimeNextMetricsReportCouldBeSentAt - Date.now(),
  );
  return sleep(waitTime, options);
};

const sendMetrics = async (
  { signal }: Readonly<{ signal: AbortSignal }>,
): Promise<void> => {
  const metricsReport = generateMetricsReport({
    packageJson: { version: "TODO" },
    os: Platform.OS,
    osVersion: Platform.Version,
    screen: Dimensions.get("screen"),
    // TODO
    observations: [],
  });

  const body = new Blob([JSON.stringify({ data: metricsReport })]);

  const response = await fetch(process.env.METRICS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": body.size.toString(),
      "Authorization": decodeMetricsAuthorization(
        process.env.METRICS_API_KEY_ENCODED,
      ),
    },
    body: JSON.stringify({ data: metricsReport }),
    credentials: "omit",
    signal,
  });

  if (!response.ok) throw new Error("Invalid response");
};

const useSendMetrics = (): void => {
  const lastMetricsReportSentAt = useLastMetricsReportSentAt((store) =>
    store.lastMetricsReportSentAt
  );
  const setLastMetricsReportSentAt = useLastMetricsReportSentAt((store) =>
    store.setLastMetricsReportSentAt
  );

  const isAppActive = useAppState() === "active";

  useEffect(() => {
    if (__DEV__) return;

    if (!isAppActive) return;

    const abortController = new AbortController();
    const { signal } = abortController;

    (async () => {
      await sleepUntilWeCanSendMetrics(lastMetricsReportSentAt, { signal });
      await sendMetrics({ signal });
      setLastMetricsReportSentAt(Date.now());
    })().catch(noop);

    return () => {
      abortController.abort();
    };
  }, [isAppActive, lastMetricsReportSentAt, setLastMetricsReportSentAt]);
};

export default useSendMetrics;
