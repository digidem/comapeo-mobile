import * as React from 'react';
import {render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';
import {Field} from '@comapeo/schema';

import {FieldDetails} from './FieldDetails';

const OPTIONS = [
  {value: 'cat', label: 'Cat'},
  {value: 'dog', label: 'Dog'},
];

function makeField(overrides: Partial<Field> = {}): Field {
  return {
    docId: 'doc-1',
    versionId: 'ver-1',
    originalVersionId: 'ver-1',
    schemaName: 'field',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    links: [],
    deleted: false,
    tagKey: 'animal',
    type: 'text',
    label: 'Animal',
    ...overrides,
  };
}

// render is async in @testing-library/react-native v14; this helper returns
// the render promise, so callers must await it.
function renderFieldDetails(props: React.ComponentProps<typeof FieldDetails>) {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <FieldDetails {...props} />
    </IntlProvider>,
  );
}

describe('FieldDetails', () => {
  it('renders the field label', async () => {
    await renderFieldDetails({fields: [makeField()], tags: {}});
    expect(screen.getByText('Animal')).toBeOnTheScreen();
  });

  describe('scalar tagValue', () => {
    it('shows the matching option label', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: 'cat'},
      });
      expect(screen.getByText('Cat')).toBeOnTheScreen();
    });

    it('shows the raw string when no option matches', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: 'fish'},
      });
      expect(screen.getByText('fish')).toBeOnTheScreen();
    });

    it('shows a number as a string', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {animal: 42},
      });
      expect(screen.getByText('42')).toBeOnTheScreen();
    });

    it('shows 0 as a string', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {animal: 0},
      });
      expect(screen.getByText('0')).toBeOnTheScreen();
    });

    it('shows "No answer" for an empty string', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {animal: ''},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });

    it('shows "No answer" for boolean true', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {animal: true},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });

    it('shows "No answer" for boolean false', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {animal: false},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });

    it('shows "No answer" when tagKey is absent from tags', async () => {
      await renderFieldDetails({
        fields: [makeField()],
        tags: {},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });

    it('shows the raw string when fieldOptions is undefined', async () => {
      await renderFieldDetails({
        fields: [makeField({options: undefined})],
        tags: {animal: 'hello'},
      });
      expect(screen.getByText('hello')).toBeOnTheScreen();
    });
  });

  describe('array tagValue', () => {
    it('maps values to labels and joins them', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['cat', 'dog']},
      });
      expect(screen.getByText('Cat, Dog')).toBeOnTheScreen();
    });

    it('falls back to raw value when no matching option', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['cat', 'fish']},
      });
      expect(screen.getByText('Cat, fish')).toBeOnTheScreen();
    });

    it('filters out the string "null"', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['cat', 'null']},
      });
      expect(screen.getByText('Cat')).toBeOnTheScreen();
    });

    it('filters out empty strings', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['cat', '']},
      });
      expect(screen.getByText('Cat')).toBeOnTheScreen();
    });

    it('filters out boolean values', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['cat', true, false]},
      });
      expect(screen.getByText('Cat')).toBeOnTheScreen();
    });

    it('shows "No answer" when all values are filtered out', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: ['null', '', true]},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });

    it('shows "No answer" for an empty array', async () => {
      await renderFieldDetails({
        fields: [makeField({options: OPTIONS})],
        tags: {animal: []},
      });
      expect(screen.getByText('No answer')).toBeOnTheScreen();
    });
  });

  it('renders multiple fields', async () => {
    const fields = [
      makeField({docId: 'doc-1', tagKey: 'animal', label: 'Animal'}),
      makeField({docId: 'doc-2', tagKey: 'color', label: 'Color'}),
    ];
    await renderFieldDetails({
      fields,
      tags: {animal: 'cat', color: 'blue'},
    });
    expect(screen.getByText('Animal')).toBeOnTheScreen();
    expect(screen.getByText('cat')).toBeOnTheScreen();
    expect(screen.getByText('Color')).toBeOnTheScreen();
    expect(screen.getByText('blue')).toBeOnTheScreen();
  });
});
