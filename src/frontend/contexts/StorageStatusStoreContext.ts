import {create} from 'zustand';
import * as v from 'valibot';

export const LOW_THRESHOLD_BYTES = 500 * 1024 * 1024;

const StorageReadingSchema = v.object({
  freeBytes: v.number(),
  totalBytes: v.number(),
});

const StoragePartialUpdateSchema = v.partial(
  v.object({
    freeBytes: v.nullable(v.number()),
    totalBytes: v.nullable(v.number()),
    isLow: v.boolean(),
    dismissedMapBannerSession: v.boolean(),
  }),
);

export type StorageReading = v.InferOutput<typeof StorageReadingSchema>;
export type StoragePartialUpdate = v.InferOutput<
  typeof StoragePartialUpdateSchema
>;

export type StorageStatusState = {
  freeBytes: number | null;
  totalBytes: number | null;
  isLow: boolean;
  dismissedMapBannerSession: boolean;
  setDismissedMapBannerSession(v: boolean): void;
  setReading(reading: StorageReading): void;
};

type StorageStatusActions = {
  setPartial: (p: StoragePartialUpdate) => void;
  dismissMapBanner: () => void;
  resetDismissal: () => void;
};

export const useStorageStatusStore = create<
  StorageStatusState & StorageStatusActions
>(set => ({
  freeBytes: null,
  totalBytes: null,
  isLow: false,
  dismissedMapBannerSession: false,

  setDismissedMapBannerSession: (v: boolean) =>
    set({dismissedMapBannerSession: v}),

  setReading: (reading: StorageReading) => {
    const parsed = v.parse(StorageReadingSchema, reading);
    set(state => {
      const isLow = parsed.freeBytes <= LOW_THRESHOLD_BYTES;
      return {
        freeBytes: parsed.freeBytes,
        totalBytes: parsed.totalBytes,
        isLow,
        dismissedMapBannerSession: isLow
          ? state.dismissedMapBannerSession
          : false,
      };
    });
  },

  setPartial: (p: StoragePartialUpdate) => {
    const parsed = v.parse(StoragePartialUpdateSchema, p);
    set(state => {
      const next: StorageStatusState = {
        ...state,
        ...parsed,
      };
      if ('isLow' in parsed && parsed.isLow === false) {
        next.dismissedMapBannerSession = false;
      }
      return next;
    });
  },

  dismissMapBanner: () => set({dismissedMapBannerSession: true}),
  resetDismissal: () => set({dismissedMapBannerSession: false}),
}));
