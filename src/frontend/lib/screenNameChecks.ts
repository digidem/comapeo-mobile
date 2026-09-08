import {
  BOTTOM_SHEET_SCREEN_NAMES,
  EDITING_SCREEN_NAMES,
  INVITE_SCREEN_NAME,
  MAP_SHARE_SCREEN_NAMES,
} from '../constants';

export function isBottomSheetScreen(routeName: string | undefined) {
  if (!routeName) return false;
  for (const name of BOTTOM_SHEET_SCREEN_NAMES) {
    if (name === routeName) return true;
  }
  return false;
}

export function isEditingScreen(routeName: string) {
  for (const name of EDITING_SCREEN_NAMES) {
    if (name === routeName) return true;
  }
  return false;
}

export function isInviteScreen(routeName: string) {
  for (const name of INVITE_SCREEN_NAME) {
    if (name === routeName) return true;
  }
  return false;
}

export function isMapShareScreen(routeName: string) {
  for (const name of MAP_SHARE_SCREEN_NAMES) {
    if (name === routeName) return true;
  }
  return false;
}
