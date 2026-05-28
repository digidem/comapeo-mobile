import {
  getUsableLanguageTagFromSystemPreferences,
  USABLE_LANGUAGES,
} from './intl';

describe('USABLE_LANGUAGES', () => {
  test('always includes English', () => {
    expect(USABLE_LANGUAGES.some(l => l.languageTag === 'en')).toBe(true);
  });

  test('every entry has required fields', () => {
    for (const lang of USABLE_LANGUAGES) {
      expect(typeof lang.languageTag).toBe('string');
      expect(typeof lang.nativeName).toBe('string');
      expect(typeof lang.englishName).toBe('string');
    }
  });

  test('is sorted alphabetically by englishName', () => {
    const names = USABLE_LANGUAGES.map(l => l.englishName);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

describe('getUsableLanguageTagFromSystemPreferences()', () => {
  test('falls back to en with no preferences', () => {
    expect(getUsableLanguageTagFromSystemPreferences([])).toBe('en');
  });

  test('falls back to en with unsupported preference', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['__'])).toBe('en');
  });

  test('returns supported base language code', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['es'])).toBe('es');
  });

  test('strips regional code to find supported language', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['es-MX'])).toBe('es');
  });

  test('respects ordering — returns first match', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['pt', 'es'])).toBe('pt');
  });

  test('skips unsupported entries to find first supported one', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['__', 'pt'])).toBe('pt');
  });

  test('falls back to en when all preferences are unsupported', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['__', '^^'])).toBe('en');
  });
});
