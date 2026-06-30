import {getFieldAnswerText} from './FormattedData';

const OPTIONS = [
  {value: 'cat', label: 'Cat'},
  {value: 'dog', label: 'Dog'},
];

describe('getFieldAnswerText', () => {
  describe('scalar tagValue', () => {
    it('returns the matching label when tagValue matches an option value', () => {
      expect(getFieldAnswerText({tagValue: 'cat', fieldOptions: OPTIONS})).toBe(
        'Cat',
      );
    });

    it('returns the raw string when no option matches', () => {
      expect(
        getFieldAnswerText({tagValue: 'fish', fieldOptions: OPTIONS}),
      ).toBe('fish');
    });

    it('returns stringified number', () => {
      expect(getFieldAnswerText({tagValue: 42, fieldOptions: OPTIONS})).toBe(
        '42',
      );
    });

    it('returns stringified 0', () => {
      expect(getFieldAnswerText({tagValue: 0, fieldOptions: OPTIONS})).toBe(
        '0',
      );
    });

    it('returns undefined for empty string', () => {
      expect(
        getFieldAnswerText({tagValue: '', fieldOptions: OPTIONS}),
      ).toBeUndefined();
    });

    it('returns undefined for boolean true', () => {
      expect(
        getFieldAnswerText({tagValue: true, fieldOptions: OPTIONS}),
      ).toBeUndefined();
    });

    it('returns undefined for boolean false', () => {
      expect(
        getFieldAnswerText({tagValue: false, fieldOptions: OPTIONS}),
      ).toBeUndefined();
    });

    it('returns undefined when tagValue is undefined', () => {
      expect(
        getFieldAnswerText({tagValue: undefined, fieldOptions: OPTIONS}),
      ).toBeUndefined();
    });

    it('returns undefined for null tagValue', () => {
      expect(
        getFieldAnswerText({tagValue: null, fieldOptions: OPTIONS}),
      ).toBeUndefined();
    });

    it('returns the raw string when fieldOptions is undefined', () => {
      expect(
        getFieldAnswerText({tagValue: 'hello', fieldOptions: undefined}),
      ).toBe('hello');
    });
  });

  describe('array tagValue', () => {
    it('maps values to their labels', () => {
      expect(
        getFieldAnswerText({tagValue: ['cat', 'dog'], fieldOptions: OPTIONS}),
      ).toBe('Cat, Dog');
    });

    it('falls back to raw value when no matching option', () => {
      expect(
        getFieldAnswerText({tagValue: ['cat', 'fish'], fieldOptions: OPTIONS}),
      ).toBe('Cat, fish');
    });

    it('filters out the string "null"', () => {
      expect(
        getFieldAnswerText({tagValue: ['cat', 'null'], fieldOptions: OPTIONS}),
      ).toBe('Cat');
    });

    it('filters out empty strings', () => {
      expect(
        getFieldAnswerText({tagValue: ['cat', ''], fieldOptions: OPTIONS}),
      ).toBe('Cat');
    });

    it('filters out boolean values', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', true, false],
          fieldOptions: OPTIONS,
        }),
      ).toBe('Cat');
    });

    it('returns an empty string when all values are filtered', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['null', '', true],
          fieldOptions: OPTIONS,
        }),
      ).toBe('');
    });

    it('returns an empty string for an empty array', () => {
      expect(getFieldAnswerText({tagValue: [], fieldOptions: OPTIONS})).toBe(
        '',
      );
    });
  });
});
