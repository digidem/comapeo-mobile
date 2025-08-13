import {create} from 'zustand';

export type StorageStatusState = {
  freeBytes: number | null;
  totalBytes: number | null;
  isLow: boolean;
  dismissedMapBannerSession: boolean;
  setDismissedMapBannerSession(v: boolean): void;
  setReading(reading: {freeBytes: number; totalBytes: number}): void;
};

type StorageStatusActions = {
  setSnapshot: (p: Partial<StorageStatusState>) => void;
  dismissMapBanner: () => void;
  resetDismissal: () => void;
};

export const LOW_THRESHOLD_BYTES = 500 * 1024 * 1024;

export const useStorageStatusStore = create<
  StorageStatusState & StorageStatusActions
>(set => ({
  freeBytes: null,
  totalBytes: null,
  isLow: false,
  dismissedMapBannerSession: false,
  setDismissedMapBannerSession: (v: boolean) =>
    set({dismissedMapBannerSession: v}),
  setReading: (reading: {freeBytes: number; totalBytes: number}) =>
    set({
      freeBytes: reading.freeBytes,
      totalBytes: reading.totalBytes,
      isLow: reading.freeBytes < LOW_THRESHOLD_BYTES,
    }),
  setSnapshot: p => set(p),
  dismissMapBanner: () => set({dismissedMapBannerSession: true}),
  resetDismissal: () => set({dismissedMapBannerSession: false}),
}));
