import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {type CoordinateFormat} from '../lib/coordinateFormat';
import {
  ManualEntryCoordinateFormatStoreProvider,
  ManualEntryCoordinateFormatStore,
  createManualEntryCoordinateFormatStore,
  useManualEntryCoordinateFormatActions,
  useManualEntryCoordinateFormat,
} from './ManualEntryCoordinateFormatStoreContext';

function createWrapper(store: ManualEntryCoordinateFormatStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <ManualEntryCoordinateFormatStoreProvider value={store}>
        {children}
      </ManualEntryCoordinateFormatStoreProvider>
    );
  };
}

test('usage of state and actions hooks', () => {
  const store = createManualEntryCoordinateFormatStore({persist: false});
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(
    () => useManualEntryCoordinateFormatActions(),
    {wrapper},
  );

  const stateHook = renderHook(() => useManualEntryCoordinateFormat(), {
    wrapper,
  });

  expect(stateHook.result.current).toBe('utm');

  for (const f of ['dd', 'dms', 'utm'] satisfies Array<CoordinateFormat>) {
    act(() => {
      actionsHook.result.current.setFormat(f);
    });

    expect(stateHook.result.current).toBe(f);
  }
});
