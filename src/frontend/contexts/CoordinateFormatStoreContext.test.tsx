import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {type CoordinateFormat} from '../lib/coordinateFormat';
import {
  CoordinateFormatStoreProvider,
  CoordinateFormatStore,
  createCoordinateFormatStore,
  useCoordinateFormatActions,
  useCoordinateFormat,
} from './CoordinateFormatStoreContext';

function createWrapper(store: CoordinateFormatStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <CoordinateFormatStoreProvider value={store}>
        {children}
      </CoordinateFormatStoreProvider>
    );
  };
}

test('usage of state and actions hooks', async () => {
  const store = createCoordinateFormatStore();
  const wrapper = createWrapper(store);

  const actionsHook = await renderHook(() => useCoordinateFormatActions(), {
    wrapper,
  });

  const stateHook = await renderHook(() => useCoordinateFormat(), {
    wrapper,
  });

  expect(stateHook.result.current).toBe('utm');

  for (const f of ['dd', 'dms', 'utm'] satisfies Array<CoordinateFormat>) {
    await act(async () => {
      actionsHook.result.current.setFormat(f);
    });

    expect(stateHook.result.current).toBe(f);
  }
});
