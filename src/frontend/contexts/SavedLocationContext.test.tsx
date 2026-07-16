import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  createSavedLocationStore,
  SavedLocationStore,
  SavedLocationStoreProvider,
  useNonReactiveSavedLocation,
  useSavedLocationActions,
} from './SavedLocationContext';
import {LocationObject} from 'expo-location';

function createWrapper(store: SavedLocationStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <SavedLocationStoreProvider value={store}>
        {children}
      </SavedLocationStoreProvider>
    );
  };
}

const mockLocationObject: LocationObject = {
  coords: {
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 10.5,
    accuracy: 5.0,
    altitudeAccuracy: 3.0,
    heading: 90,
    speed: 2.5,
  },
  timestamp: Date.now(),
  mocked: false,
};

test('state hook is non reactive', async () => {
  const store = createSavedLocationStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useSavedLocationActions(), {
    wrapper,
  });

  const stateHook = await renderHook(() => useNonReactiveSavedLocation(), {
    wrapper,
  });

  // Initial state
  expect(stateHook.result.current).toStrictEqual({
    savedLocation: null,
  });

  await act(async () => {
    actionsHook.result.current.setSavedLocation(mockLocationObject);
  });

  //hook should not be reactive so it should still be null
  expect(stateHook.result.current).toStrictEqual({
    savedLocation: null,
  });
});

test('action updates state', async () => {
  const store = createSavedLocationStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useSavedLocationActions(), {
    wrapper,
  });

  await act(async () => {
    actionsHook.result.current.setSavedLocation(mockLocationObject);
  });

  const stateHook = await renderHook(() => useNonReactiveSavedLocation(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual({
    savedLocation: mockLocationObject,
  });
});
