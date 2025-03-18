import {extractLanguageCode, resolveLanguageTag} from './intl';

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

describe('resolveLanguageTag()', () => {
  test('unsupported system preference', () => {
    const result = resolveLanguageTag({
      from: 'system',
      languageTags: ['__'],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });

  test('supported system preference (base language code only)', () => {
    const result = resolveLanguageTag({
      from: 'system',
      languageTags: ['es'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  // TODO: Not sure if the truncation is a desired outcome, but it matches pre-existing behavior
  test('supported system preference (base + regional code)', () => {
    const result = resolveLanguageTag({
      from: 'system',
      languageTags: ['es-MX'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  test('multiple supported system preferences', () => {
    {
      const result = resolveLanguageTag({
        from: 'system',
        languageTags: ['pt', 'es'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }

    {
      const result = resolveLanguageTag({
        from: 'system',
        languageTags: ['__', 'pt'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }
  });

  test('supported selected locale', () => {
    {
      const result = resolveLanguageTag({
        from: 'selected',
        languageTags: ['pt'],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt',
      });
    }

    // TODO: Not sure if the truncation is a desired outcome, but it matches pre-existing behavior
    {
      const result = resolveLanguageTag({
        from: 'selected',
        languageTags: ['pt-BR'],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt',
      });
    }
  });

  test('unsupported selected locale', () => {
    const result = resolveLanguageTag({
      from: 'selected',
      languageTags: ['__'],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});
