import {useMapStyleUrl} from '@comapeo/core-react';

export function useMapStyleJsonUrl() {
  const {data, error, isRefetching} = useMapStyleUrl();

  // If we're running E2E tests (e.g. on BrowserStack), fall back to a
  // public Mapbox style rather than our local style server to avoid 502 errors.
  // (see https://github.com/digidem/comapeo-mobile/issues/1008)
  if (process.env.EXPO_PUBLIC_E2E_TEST) {
    return {
      data: 'mapbox://styles/mapbox/streets-v11',
      error: null,
      isRefetching: false,
    };
  }

  return {
    data,
    error,
    isRefetching,
  };
}
