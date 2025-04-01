import {act, renderHook} from '@testing-library/react-native';
import {type ReactNode} from 'react';

import {
  MetricsDiagnosticsStoreProvider,
  createMetricsDiagnosticsStore,
  useMetricsDiagnosticsActions,
  useMetricsDiagnosticsEnabled,
  type MetricsDiagnosticsStore,
} from './MetricsDiagnosticsStoreContext';

function createWrapper(store: MetricsDiagnosticsStore) {
  return ({children}: {children: ReactNode}) => {
    return (
      <MetricsDiagnosticsStoreProvider value={store}>
        {children}
      </MetricsDiagnosticsStoreProvider>
    );
  };
}

test('usage of state and actions hooks', () => {
  const activeProjectStore = createMetricsDiagnosticsStore({persist: false});
  const wrapper = createWrapper(activeProjectStore);

  const actionsHook = renderHook(() => useMetricsDiagnosticsActions(), {
    wrapper,
  });

  const stateHook = renderHook(() => useMetricsDiagnosticsEnabled(), {
    wrapper,
  });

  expect(stateHook.result.current).toStrictEqual(true);

  act(() => {
    actionsHook.result.current.setIsEnabled(false);
  });

  expect(stateHook.result.current).toStrictEqual(false);

  act(() => {
    actionsHook.result.current.setIsEnabled(true);
  });

  expect(stateHook.result.current).toStrictEqual(true);
});
