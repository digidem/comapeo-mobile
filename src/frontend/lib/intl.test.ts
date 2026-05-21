import {
  extractLanguageCode,
  getUsableLanguageTagFromSystemPreferences,
  isSupportedLanguageTag,
  USABLE_LANGUAGES,
} from './intl';

describe('extractLanguageCode()', () => {
  test('works with single component language tag', () => {
    expect(extractLanguageCode('pt')).toBe('pt');
  });

  test('works with two component language tag', () => {
    expect(extractLanguageCode('pt-BR')).toBe('pt');
  });
});

describe('isSupportedLanguageTag()', () => {
  test('returns true for a known supported tag', () => {
    expect(isSupportedLanguageTag('en')).toBe(true);
  });

  test('returns true for a known regional tag in languages.json', () => {
    expect(isSupportedLanguageTag('pt-BR')).toBe(true);
  });

  test('returns false for an unsupported tag', () => {
    expect(isSupportedLanguageTag('__')).toBe(false);
  });

  test('returns false for empty string', () => {
    expect(isSupportedLanguageTag('')).toBe(false);
  });
});

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

  test('every entry has a tag that passes isSupportedLanguageTag', () => {
    for (const lang of USABLE_LANGUAGES) {
      expect(isSupportedLanguageTag(lang.languageTag)).toBe(true);
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

  test('returned tag passes isSupportedLanguageTag', () => {
    const result = getUsableLanguageTagFromSystemPreferences(['es-MX']);
    expect(isSupportedLanguageTag(result)).toBe(true);
  });
});
