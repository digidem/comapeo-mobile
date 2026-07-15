import * as React from 'react';
import {render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {Migrating} from './Migrating';
import {parseMigrationProgress} from '../../lib/parseMigrationProgress';

function renderScreen(progress: {done: number; total: number} | null) {
  render(
    <IntlProvider locale="en" messages={{}}>
      <Migrating progress={progress} />
    </IntlProvider>,
  );
}

describe('Migrating', () => {
  test('renders the update info and keep-open warning', () => {
    renderScreen({done: 3, total: 12});

    expect(
      screen.getByText('Do not close app while updating!'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Updating CoMapeo…')).toBeOnTheScreen();
    expect(
      screen.getByText('Projects are migrating to a newer, faster format'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('All data is safe and protected'),
    ).toBeOnTheScreen();
  });

  test('shows the progress count when progress is known', () => {
    renderScreen({done: 3, total: 12});

    expect(screen.getByText('Updating 3 of 12…')).toBeOnTheScreen();
  });

  test('hides the progress count while waiting for the first progress report', () => {
    renderScreen(null);

    expect(screen.queryByText(/Updating \d+ of \d+/)).not.toBeOnTheScreen();
  });
});

describe('parseMigrationProgress', () => {
  test('parses a done/total context string', () => {
    expect(parseMigrationProgress('3/12')).toEqual({done: 3, total: 12});
  });

  test('returns null for the initial empty context', () => {
    expect(parseMigrationProgress('')).toBeNull();
    expect(parseMigrationProgress(undefined)).toBeNull();
  });

  test('returns null for malformed or zero-total contexts', () => {
    expect(parseMigrationProgress('3 of 12')).toBeNull();
    expect(parseMigrationProgress('3/')).toBeNull();
    expect(parseMigrationProgress('0/0')).toBeNull();
  });

  test('forces done to total (backend counts can disagree)', () => {
    expect(parseMigrationProgress('15/12')).toEqual({done: 12, total: 12});
  });
});
