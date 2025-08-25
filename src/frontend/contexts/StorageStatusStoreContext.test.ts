import {act, renderHook} from '@testing-library/react-native';
import {
  useStorageStatusStore,
  LOW_THRESHOLD_BYTES,
} from './StorageStatusStoreContext';

function resetStore() {
  const {setPartial, resetDismissal} = useStorageStatusStore.getState();
  act(() => {
    setPartial({freeBytes: null, totalBytes: null, isLow: false});
    resetDismissal();
  });
}

beforeEach(() => {
  resetStore();
});

test('initial state', () => {
  const {result} = renderHook(() => useStorageStatusStore());
  expect(result.current.freeBytes).toBeNull();
  expect(result.current.totalBytes).toBeNull();
  expect(result.current.isLow).toBe(false);
  expect(result.current.dismissedMapBannerSession).toBe(false);
});

test('setReading below threshold sets isLow=true (does not auto-clear dismissal)', () => {
  const {result} = renderHook(() => useStorageStatusStore());
  act(() => {
    result.current.setReading({
      freeBytes: LOW_THRESHOLD_BYTES - 1,
      totalBytes: 10 * 1024 * 1024 * 1024,
    });
  });
  expect(result.current.isLow).toBe(true);
  expect(result.current.freeBytes).toBeLessThanOrEqual(LOW_THRESHOLD_BYTES);
});

test('setReading above threshold sets isLow=false and clears dismissedMapBannerSession', () => {
  const {result} = renderHook(() => useStorageStatusStore());
  act(() => {
    result.current.setPartial({dismissedMapBannerSession: true});
    result.current.setReading({
      freeBytes: LOW_THRESHOLD_BYTES + 1,
      totalBytes: 10 * 1024 * 1024 * 1024,
    });
  });
  expect(result.current.isLow).toBe(false);
  expect(result.current.dismissedMapBannerSession).toBe(false);
});

test('setPartial merges partial updates; isLow=false also clears dismissal', () => {
  const {result} = renderHook(() => useStorageStatusStore());
  act(() => {
    result.current.setPartial({
      freeBytes: 123,
      dismissedMapBannerSession: true,
      isLow: true,
    });
  });
  expect(result.current.freeBytes).toBe(123);
  expect(result.current.isLow).toBe(true);
  expect(result.current.dismissedMapBannerSession).toBe(true);

  act(() => {
    result.current.setPartial({isLow: false});
  });
  expect(result.current.isLow).toBe(false);
  expect(result.current.dismissedMapBannerSession).toBe(false);
});

test('dismiss + resetDismissal toggles the session flag', () => {
  const {result} = renderHook(() => useStorageStatusStore());
  act(() => {
    result.current.dismissMapBanner();
  });
  expect(result.current.dismissedMapBannerSession).toBe(true);

  act(() => {
    result.current.resetDismissal();
  });
  expect(result.current.dismissedMapBannerSession).toBe(false);
});
