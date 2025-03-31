import {extractLanguageCode, getAppLanguageTag} from './intl';

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

describe('getAppLanguageTag()', () => {
  test('use system - unsupported system preference', () => {
    const result = getAppLanguageTag({
      localeState: {
        useSystemPreferences: true,
        languageTag: null,
      },
      systemLanguageTags: ['__'],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });

  test('use system - supported system preference (base language code only)', () => {
    const result = getAppLanguageTag({
      localeState: {
        useSystemPreferences: true,
        languageTag: null,
      },
      systemLanguageTags: ['es'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  // TODO: Not sure if the truncation is a desired outcome, but it matches pre-existing behavior
  test('use system - supported system preference (base + regional code)', () => {
    const result = getAppLanguageTag({
      localeState: {
        useSystemPreferences: true,
        languageTag: null,
      },
      systemLanguageTags: ['es-MX'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  test('use system - multiple supported system preferences', () => {
    {
      const result = getAppLanguageTag({
        localeState: {
          useSystemPreferences: true,
          languageTag: null,
        },
        systemLanguageTags: ['pt', 'es'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }

    {
      const result = getAppLanguageTag({
        localeState: {
          useSystemPreferences: true,
          languageTag: null,
        },
        systemLanguageTags: ['__', 'pt'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }
  });

  test('use selected - supported selected locale', () => {
    {
      const result = getAppLanguageTag({
        localeState: {
          useSystemPreferences: false,
          languageTag: 'pt',
        },
        systemLanguageTags: [],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt',
      });
    }

    {
      const result = getAppLanguageTag({
        localeState: {
          useSystemPreferences: false,
          languageTag: 'pt-BR',
        },
        systemLanguageTags: [],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt-BR',
      });
    }
  });
});
