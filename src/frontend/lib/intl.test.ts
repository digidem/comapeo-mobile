import {
  extractLanguageCode,
  getUsableLanguageTagFromSystemPreferences,
} from './intl';

describe('extractLanguageCode()', () => {
  test('works with single component language tag', () => {
    const result = extractLanguageCode('pt');

    expect(result).toBe('pt');
  });

  test('works with two component language tag', () => {
    const result = extractLanguageCode('pt-BR');

    expect(result).toBe('pt');
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

  test('respects ordering of preferences', () => {
    expect(getUsableLanguageTagFromSystemPreferences(['pt', 'es'])).toBe('pt');
    expect(getUsableLanguageTagFromSystemPreferences(['__', 'pt'])).toBe('pt');
  });
});
