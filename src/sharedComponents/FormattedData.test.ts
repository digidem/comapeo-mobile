import {createIntl} from 'react-intl';
import {getFieldAnswerText} from './FormattedData';

const OPTIONS = [
  {value: 'cat', label: 'Cat'},
  {value: 'dog', label: 'Dog'},
];

// Pin timeZone so formatted dates don't depend on the host machine's locale.
const {formatDate} = createIntl({locale: 'en', timeZone: 'UTC'});

describe('getFieldAnswerText', () => {
  describe('scalar tagValue', () => {
    it('returns the matching label when tagValue matches an option value', () => {
      expect(
        getFieldAnswerText({
          tagValue: 'cat',
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat');
    });

    it('returns the raw string when no option matches', () => {
      expect(
        getFieldAnswerText({
          tagValue: 'fish',
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('fish');
    });

    it('returns stringified number', () => {
      expect(
        getFieldAnswerText({tagValue: 42, fieldOptions: OPTIONS, formatDate}),
      ).toBe('42');
    });

    it('returns stringified 0', () => {
      expect(
        getFieldAnswerText({tagValue: 0, fieldOptions: OPTIONS, formatDate}),
      ).toBe('0');
    });

    it('returns undefined for empty string', () => {
      expect(
        getFieldAnswerText({tagValue: '', fieldOptions: OPTIONS, formatDate}),
      ).toBeUndefined();
    });

    it('returns undefined for boolean true', () => {
      expect(
        getFieldAnswerText({tagValue: true, fieldOptions: OPTIONS, formatDate}),
      ).toBeUndefined();
    });

    it('returns undefined for boolean false', () => {
      expect(
        getFieldAnswerText({
          tagValue: false,
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBeUndefined();
    });

    it('returns undefined when tagValue is undefined', () => {
      expect(
        getFieldAnswerText({
          tagValue: undefined,
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBeUndefined();
    });

    it('returns undefined for null tagValue', () => {
      expect(
        getFieldAnswerText({tagValue: null, fieldOptions: OPTIONS, formatDate}),
      ).toBeUndefined();
    });

    it('returns the raw string when fieldOptions is undefined', () => {
      expect(
        getFieldAnswerText({
          tagValue: 'hello',
          fieldOptions: undefined,
          formatDate,
        }),
      ).toBe('hello');
    });
  });

  describe('date tagValue', () => {
    it('formats an ISO date string using medium date style', () => {
      expect(
        getFieldAnswerText({
          tagValue: '2024-03-15T00:00:00.000Z',
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Mar 15, 2024');
    });
  });

  describe('array tagValue', () => {
    it('maps values to their labels', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', 'dog'],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat, Dog');
    });

    it('falls back to raw value when no matching option', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', 'fish'],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat, fish');
    });

    it('filters out the string "null"', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', 'null'],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat');
    });

    it('filters out empty strings', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', ''],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat');
    });

    it('filters out boolean values', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['cat', true, false],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('Cat');
    });

    it('returns an empty string when all values are filtered', () => {
      expect(
        getFieldAnswerText({
          tagValue: ['null', '', true],
          fieldOptions: OPTIONS,
          formatDate,
        }),
      ).toBe('');
    });

    it('returns an empty string for an empty array', () => {
      expect(
        getFieldAnswerText({tagValue: [], fieldOptions: OPTIONS, formatDate}),
      ).toBe('');
    });
  });
});
