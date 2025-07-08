import {EDITING_SCREEN_NAMES, INVITE_SCREEN_NAME} from '../constants';

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
