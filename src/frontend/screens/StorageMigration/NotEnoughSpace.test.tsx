import * as React from 'react';
import {Linking} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {NotEnoughSpace} from './NotEnoughSpace';

async function renderScreen({
  spaceNeededBytes = null,
  onRetry = jest.fn(),
}: {
  spaceNeededBytes?: number | null;
  onRetry?: jest.Mock;
} = {}) {
  await render(
    <IntlProvider locale="en" messages={{}}>
      <NotEnoughSpace spaceNeededBytes={spaceNeededBytes} onRetry={onRetry} />
    </IntlProvider>,
  );
  return {onRetry};
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

  test('shows the space still needed when known', async () => {
    await renderScreen({spaceNeededBytes: 52_428_800});

    expect(
      screen.getByText('~50 MB more required to update'),
    ).toBeOnTheScreen();
  });

  test('falls back to a generic message when the space needed is unknown', async () => {
    await renderScreen({spaceNeededBytes: null});

    expect(
      screen.getByText('More storage required to update'),
    ).toBeOnTheScreen();
  });

  test('tapping "Skip for Now" retries, skipping migration', async () => {
    const {onRetry} = await renderScreen();

    await fireEvent.press(screen.getByText('Skip for Now'));

    expect(onRetry).toHaveBeenCalledWith({forceSkipMigrate: true});
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
