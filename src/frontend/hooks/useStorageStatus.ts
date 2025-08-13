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

  const setSnapshot = useStorageStatusStore(s => s.setSnapshot);

  const check = React.useCallback(async () => {
    try {
      const [free, total] = await Promise.all([
        DeviceInfo.getFreeDiskStorage(),
        DeviceInfo.getTotalDiskCapacity(),
      ]);
      setSnapshot({
        freeBytes: free,
        totalBytes: total,
        isLow: free <= threshold,
      });
    } catch {
      setSnapshot({
        freeBytes: null,
        totalBytes: null,
        isLow: false,
      });
    }
  }, [setSnapshot, threshold]);

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
