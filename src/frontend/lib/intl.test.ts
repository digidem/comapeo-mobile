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
  test('no selected locale and no system preferences', () => {
    const result = resolveLanguageTag({
      selected: null,
      systemPreferred: [],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });

  test('no selected locale and an unsupported system preference', () => {
    const result = resolveLanguageTag({
      selected: null,
      systemPreferred: ['__'],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });

  test('no selected locale and a supported system preference (base language code only)', () => {
    const result = resolveLanguageTag({
      selected: null,
      systemPreferred: ['es'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  // TODO: Not sure if the truncation is a desired outcome, but it matches pre-existing behavior
  test('no selected locale and a supported system preference (base + regional code)', () => {
    const result = resolveLanguageTag({
      selected: null,
      systemPreferred: ['es-MX'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  test('no selected locale and multiple supported system preferences', () => {
    {
      const result = resolveLanguageTag({
        selected: null,
        systemPreferred: ['pt', 'es'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }

    {
      const result = resolveLanguageTag({
        selected: null,
        systemPreferred: ['__', 'pt'],
      });

      expect(result).toStrictEqual({
        source: 'system',
        value: 'pt',
      });
    }
  });

  test('supported selected locale and no system preferences', () => {
    {
      const result = resolveLanguageTag({
        selected: 'pt',
        systemPreferred: [],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt',
      });
    }

    // TODO: Not sure if the truncation is a desired outcome, but it matches pre-existing behavior
    {
      const result = resolveLanguageTag({
        selected: 'pt-BR',
        systemPreferred: [],
      });

      expect(result).toStrictEqual({
        source: 'selected',
        value: 'pt',
      });
    }
  });

  test('supported selected locale and supported system preference', () => {
    const result = resolveLanguageTag({
      selected: 'pt',
      systemPreferred: ['es'],
    });

    expect(result).toStrictEqual({
      source: 'selected',
      value: 'pt',
    });
  });

  test('unsupported selected locale and supported system preference', () => {
    const result = resolveLanguageTag({
      selected: '__',
      systemPreferred: ['es'],
    });

    expect(result).toStrictEqual({
      source: 'system',
      value: 'es',
    });
  });

  test('unsupported selected locale and no system preference', () => {
    const result = resolveLanguageTag({
      selected: '__',
      systemPreferred: [],
    });

    expect(result).toStrictEqual({
      source: 'fallback',
      value: 'en',
    });
  });
});
