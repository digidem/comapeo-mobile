import {
  type SettingsState,
  useSettingsState,
} from '../../contexts/SettingsStoreContext';
import {type CoordinateFormat} from '../../lib/coordinateFormat';

function selector(state: SettingsState): CoordinateFormat {
  return state.coordinateFormat ? state.coordinateFormat : 'utm';
}

/**
 * Resolves the coordinate format based on the settings. If the settings does not explicitly specify a value, falls back to `'utm'`.
 */
export function useCoordinateFormat(): CoordinateFormat {
  return useSettingsState(selector);
}
