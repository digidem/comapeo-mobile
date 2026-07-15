import * as React from 'react';
import {Text} from 'react-native';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';
import {createStore} from 'zustand';

import {ServerLoading} from './ServerLoading';
import type {ServerState} from './lib/ServerStateStore';

function setup(initial: ServerState) {
  const store = createStore<ServerState>(() => initial);
  const onSkipMigration = jest.fn();
  render(
    <IntlProvider locale="en" messages={{}}>
      <ServerLoading serverStateStore={store} onSkipMigration={onSkipMigration}>
        <Text>APP CONTENT</Text>
      </ServerLoading>
    </IntlProvider>,
  );
  return {store, onSkipMigration};
}

describe('ServerLoading', () => {
  test('shows Update Complete after a migration finishes, until acknowledged', () => {
    const {store} = setup({value: 'MIGRATING', context: '1/5'});

    expect(screen.getByText('Updating CoMapeo…')).toBeOnTheScreen();
    expect(screen.getByText('Updating 1 of 5…')).toBeOnTheScreen();

    act(() => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('Update Complete!')).toBeOnTheScreen();
    expect(screen.queryByText('APP CONTENT')).not.toBeOnTheScreen();

    fireEvent.press(screen.getByText('Continue'));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
  });

  test('does not show Update Complete when no migration happened', () => {
    const {store} = setup({value: 'STARTING'});

    act(() => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
    expect(screen.queryByText('Update Complete!')).not.toBeOnTheScreen();
  });

  test('shows the migration error screen with the backend error message', () => {
    setup({value: 'MIGRATION_ERROR', error: 'ENOSPC: no space left on device'});

    expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Advanced'));

    expect(
      screen.getByText('ENOSPC: no space left on device'),
    ).toBeOnTheScreen();
  });

  test('skipping from LOW_SPACE goes straight to the app once started', () => {
    const {store, onSkipMigration} = setup({value: 'LOW_SPACE'});

    expect(screen.getByText('Update CoMapeo')).toBeOnTheScreen();

    fireEvent.press(screen.getByText('Skip for Now'));
    expect(onSkipMigration).toHaveBeenCalledTimes(1);

    act(() => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
    expect(screen.queryByText('Update Complete!')).not.toBeOnTheScreen();
  });
});
