import * as React from 'react';
import {Text} from 'react-native';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';
import {createStore} from 'zustand';

import {ServerLoading} from './ServerLoading';
import type {ServerState} from './lib/ServerStateStore';

async function setup(initial: ServerState) {
  const store = createStore<ServerState>(() => initial);
  const onRetryAfterLowSpace = jest.fn();
  await render(
    <IntlProvider locale="en" messages={{}}>
      <ServerLoading
        serverStateStore={store}
        onRetryAfterLowSpace={onRetryAfterLowSpace}>
        <Text>APP CONTENT</Text>
      </ServerLoading>
    </IntlProvider>,
  );
  return {store, onRetryAfterLowSpace};
}

describe('ServerLoading', () => {
  test('shows Update Complete after a migration finishes, until acknowledged', async () => {
    const {store} = await setup({value: 'MIGRATING', context: '1/5'});

    expect(screen.getByText('Updating CoMapeo…')).toBeOnTheScreen();
    expect(screen.getByText('Updating 1 of 5…')).toBeOnTheScreen();

    await act(async () => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('Update Complete!')).toBeOnTheScreen();
    expect(screen.queryByText('APP CONTENT')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Continue'));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
  });

  test('does not show Update Complete when no migration happened', async () => {
    const {store} = await setup({value: 'STARTING'});

    await act(async () => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
    expect(screen.queryByText('Update Complete!')).not.toBeOnTheScreen();
  });

  test('shows the migration error screen with the backend error message', async () => {
    await setup({
      value: 'MIGRATION_ERROR',
      error: 'ENOSPC: no space left on device',
    });

    expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Advanced'));

    expect(
      screen.getByText('ENOSPC: no space left on device'),
    ).toBeOnTheScreen();
  });

  test('shows how much more space is needed', async () => {
    await setup({value: 'LOW_SPACE', context: '52428800'});

    expect(
      screen.getByText('~50 MB more required to update'),
    ).toBeOnTheScreen();
  });

  test('skipping from LOW_SPACE goes straight to the app once started', async () => {
    const {store, onRetryAfterLowSpace} = await setup({value: 'LOW_SPACE'});

    expect(screen.getByText('Update CoMapeo')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Skip for Now'));
    expect(onRetryAfterLowSpace).toHaveBeenCalledWith({
      forceSkipMigrate: true,
    });

    await act(async () => store.setState({value: 'STARTED'}, true));

    expect(screen.getByText('APP CONTENT')).toBeOnTheScreen();
    expect(screen.queryByText('Update Complete!')).not.toBeOnTheScreen();
  });
});
