import {EDITING_SCREEN_NAMES} from '../constants';

export function isEditingScreen(routeName: string) {
  for (const name of EDITING_SCREEN_NAMES) {
    if (name === routeName) return true;
  }
  return false;
}
