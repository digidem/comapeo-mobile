import * as React from 'react';
import DeviceInfo from 'react-native-device-info';
import {AppState} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {
  useStorageStatusStore,
  LOW_THRESHOLD_BYTES,
} from '../contexts/StorageStatusStoreContext';

type Options = {
  thresholdBytes?: number;
  pollMs?: number;
  enabled?: boolean;
};

export function useStorageStatus(opts: Options = {}) {
  const threshold = opts.thresholdBytes ?? LOW_THRESHOLD_BYTES;
  const pollMs = opts.pollMs ?? 30000;
  const enabled = opts.enabled ?? true;

  const setReading = useStorageStatusStore(s => s.setReading);
  const setPartial = useStorageStatusStore(s => s.setPartial);

  const check = React.useCallback(async () => {
    try {
      const [free, total] = await Promise.all([
        DeviceInfo.getFreeDiskStorage(),
        DeviceInfo.getTotalDiskCapacity(),
      ]);
      setReading({freeBytes: free, totalBytes: total});
      if (threshold !== LOW_THRESHOLD_BYTES) {
        setPartial({isLow: free <= threshold});
      }
    } catch {
      setPartial({
        freeBytes: null,
        totalBytes: null,
      });
    }
  }, [setReading, setPartial, threshold]);

  React.useEffect(() => {
    if (!enabled) return;
    const subscribe = AppState.addEventListener('change', status => {
      if (status === 'active') check();
    });
    return () => subscribe.remove();
  }, [check, enabled]);

  React.useEffect(() => {
    if (enabled) check();
  }, [check, enabled]);

  React.useEffect(() => {
    if (!enabled) return;
    const id = setInterval(check, pollMs);
    return () => clearInterval(id);
  }, [check, pollMs, enabled]);

  return {
    refresh: check,
  };
}

export function useRefreshStorageStatusOnFocus() {
  const {refresh} = useStorageStatus();
  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh]),
  );
}
