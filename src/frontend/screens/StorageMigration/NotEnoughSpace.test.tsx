import * as React from 'react';
import {Linking} from 'react-native';
import {fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {NotEnoughSpace} from './NotEnoughSpace';

function renderScreen(onSkip = jest.fn()) {
  render(
    <IntlProvider locale="en" messages={{}}>
      <NotEnoughSpace onSkip={onSkip} />
    </IntlProvider>,
  );
  return {onSkip};
}

describe('NotEnoughSpace', () => {
  test('renders the update info and low-space warning', () => {
    renderScreen();

    expect(screen.getByText('Free up space to continue.')).toBeOnTheScreen();
    expect(screen.getByText('Update CoMapeo')).toBeOnTheScreen();
    expect(
      screen.getByText('New update available with performance improvements'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('All data is safe and protected'),
    ).toBeOnTheScreen();
  });

  test('tapping "Skip for Now" calls onSkip', () => {
    const {onSkip} = renderScreen();

    fireEvent.press(screen.getByText('Skip for Now'));

    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  test('tapping "Open Storage Settings" opens the Android storage settings', () => {
    const sendIntentSpy = jest.spyOn(Linking, 'sendIntent').mockResolvedValue();
    renderScreen();

    fireEvent.press(screen.getByText('Open Storage Settings'));

    expect(sendIntentSpy).toHaveBeenCalledWith(
      'android.settings.INTERNAL_STORAGE_SETTINGS',
    );
  });
});
