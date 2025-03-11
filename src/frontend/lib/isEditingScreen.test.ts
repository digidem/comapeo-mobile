import {EDITING_SCREEN_NAMES} from '../constants';
import {isEditingScreen} from './isEditingScreen';

describe('isNotEditingScreen', () => {
  it('should return true for editing screen names', () => {
    for (const screen of EDITING_SCREEN_NAMES) {
      expect(isEditingScreen(screen as string)).toBe(true);
    }
  });

  it('should return false for non-editing screen names', () => {
    expect(isEditingScreen('Home')).toBe(false);
    expect(isEditingScreen('Settings')).toBe(false);
    expect(isEditingScreen('Profile')).toBe(false);
  });

  it('should return false for an empty string', () => {
    expect(isEditingScreen('')).toBe(false);
  });

  it('should return false for a completely unrelated screen name', () => {
    expect(isEditingScreen('RandomScreen')).toBe(false);
  });
});
