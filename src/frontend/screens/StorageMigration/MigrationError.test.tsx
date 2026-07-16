import * as React from 'react';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {MigrationError} from './MigrationError';

jest.mock('react-native-restart', () => ({restart: jest.fn()}));
import RNRestart from 'react-native-restart';

async function renderScreen(errorMessage?: string) {
  await render(
    <IntlProvider locale="en" messages={{}}>
      <MigrationError errorMessage={errorMessage} />
    </IntlProvider>,
  );
}

describe('MigrationError', () => {
  test('renders the generic error UI with details collapsed', async () => {
    await renderScreen('ENOSPC: no space left on device');

    expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();
    expect(screen.getByText('Advanced')).toBeOnTheScreen();
    expect(
      screen.queryByText('ENOSPC: no space left on device'),
    ).not.toBeOnTheScreen();
  });

  test('expands Advanced to show the backend error message', async () => {
    await renderScreen('ENOSPC: no space left on device');

    await fireEvent.press(screen.getByText('Advanced'));

    expect(
      screen.getByText('ENOSPC: no space left on device'),
    ).toBeOnTheScreen();
  });

  test('falls back to "Unknown error" when no message is provided', async () => {
    await renderScreen(undefined);

    await fireEvent.press(screen.getByText('Advanced'));

    expect(screen.getByText('Unknown error')).toBeOnTheScreen();
  });

  test('Restart App restarts the app process', async () => {
    await renderScreen('boom');

    await fireEvent.press(screen.getByText('Restart App'));

    expect(RNRestart.restart).toHaveBeenCalledTimes(1);
  });
});
