import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {type CoordinateFormat} from '../lib/coordinateFormat';
import {
  ManualEntryCoordinateFormatProvider,
  ManualEntryCoordinateFormatStore,
  createManualEntryCoordinateFormatStore,
  useManualEntryCoordinateFormatActions,
  useManualEntryCoordinateFormatState,
} from './ManualEntryCoordinateFormatContext';

function createWrapper(store: ManualEntryCoordinateFormatStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <ManualEntryCoordinateFormatProvider value={store}>
        {children}
      </ManualEntryCoordinateFormatProvider>
    );
  };
}

test('usage of state and actions hooks', () => {
  const store = createManualEntryCoordinateFormatStore();
  const wrapper = createWrapper(store);

  const actionsHook = renderHook(
    () => useManualEntryCoordinateFormatActions(),
    {wrapper},
  );

  const stateHook = renderHook(() => useManualEntryCoordinateFormatState(), {
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
