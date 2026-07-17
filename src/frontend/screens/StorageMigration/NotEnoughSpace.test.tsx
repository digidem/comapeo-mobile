import * as React from 'react';
import {Linking} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {NotEnoughSpace} from './NotEnoughSpace';

jest.mock('../../lib/retryServerStart', () => ({retryServerStart: jest.fn()}));
import {retryServerStart} from '../../lib/retryServerStart';

async function renderScreen() {
  await render(
    <IntlProvider locale="en" messages={{}}>
      <NotEnoughSpace />
    </IntlProvider>,
  );
}

describe('NotEnoughSpace', () => {
  test('renders the update info and low-space warning', async () => {
    await renderScreen();

    expect(screen.getByText('Free up space to continue.')).toBeOnTheScreen();
    expect(screen.getByText('Update CoMapeo')).toBeOnTheScreen();
    expect(
      screen.getByText('New update available with performance improvements'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('All data is safe and protected'),
    ).toBeOnTheScreen();
  });

  test('tapping "Skip for Now" asks the backend to restart, skipping migration', async () => {
    await renderScreen();

    await fireEvent.press(screen.getByText('Skip for Now'));

    expect(retryServerStart).toHaveBeenCalledWith({forceSkipMigrate: true});
  });

  test('tapping "Open Storage Settings" opens the Android storage settings', async () => {
    const sendIntentSpy = jest.spyOn(Linking, 'sendIntent').mockResolvedValue();
    await renderScreen();

    await fireEvent.press(screen.getByText('Open Storage Settings'));

    expect(sendIntentSpy).toHaveBeenCalledWith(
      'android.settings.INTERNAL_STORAGE_SETTINGS',
    );
  });
});
