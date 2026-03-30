import * as React from 'react';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {ErrorBottomSheet} from './ErrorBottomSheet';
import type {AppStackParamsList} from '../sharedTypes/navigation';

jest.mock('../images/Error.svg', () => 'ErrorIcon');
jest.mock('../images/chevrondown.svg', () => 'ChevronDown');
jest.mock('../images/chevrondown-expanded.svg', () => 'ChevronUp');
jest.mock('./BottomSheetWrapper', () => ({
  BottomSheetWrapper: ({children}: {children: React.ReactNode}) => children,
}));

const Stack = createNativeStackNavigator<AppStackParamsList>();
const navigationRef = createNavigationContainerRef<AppStackParamsList>();

function TestNavigator({error}: {error: Error & {code?: string}}) {
  return (
    <IntlProvider locale="en" messages={{}}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="ErrorBottomSheet"
            component={ErrorBottomSheet}
            initialParams={{error}}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </IntlProvider>
  );
}

describe('ErrorBottomSheet', () => {
  it('should render error title', async () => {
    const error = new Error('Test error message');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();
    });
  });

  it('should render Advanced button', async () => {
    const error = new Error('Test error message');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });
  });

  it('should not show error details initially', async () => {
    const error = new Error('Test error message');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    expect(screen.queryByText('Test error message')).not.toBeOnTheScreen();
  });

  it('should show error details when Advanced is clicked', async () => {
    const error = new Error('Test error message');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/Test error message/)).toBeOnTheScreen();
    });
  });

  it('should hide error details when Advanced is clicked again', async () => {
    const error = new Error('Test error message');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');

    fireEvent.press(advancedButton);
    await waitFor(() => {
      expect(screen.getByText(/Test error message/)).toBeOnTheScreen();
    });

    fireEvent.press(advancedButton);
    await waitFor(() => {
      expect(screen.queryByText('Test error message')).not.toBeOnTheScreen();
    });
  });

  it('should display error code when available', async () => {
    const error = new Error('Test error message') as Error & {code?: string};
    error.code = 'INVITE_ABORTED';
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/INVITE_ABORTED/)).toBeOnTheScreen();
    });
  });

  it('should display error stack trace when available', async () => {
    const error = new Error('Detailed error message');
    error.stack =
      'Error: Detailed error message\n    at TestFunction (test.ts:10:5)';
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/TestFunction/)).toBeOnTheScreen();
    });
  });

  it('should display CoMapeo Core error with code', async () => {
    const error = new Error(
      'Collaborator canceled sharing without completing.',
    ) as Error & {code?: string};
    error.code = 'INVITE_ABORTED';
    error.stack = `Error: Collaborator canceled sharing without completing.
    at InviteManager.sendInvite (InviteManager.ts:45:11)
    at ReviewAndInvite.sendInvite (ReviewAndInvite.tsx:30:25)`;

    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/INVITE_ABORTED/)).toBeOnTheScreen();
      expect(screen.getByText(/InviteManager/)).toBeOnTheScreen();
    });
  });

  it('should render Close button', async () => {
    const error = new Error('Test error');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeOnTheScreen();
    });
  });

  it('should handle error with empty message', async () => {
    const error = new Error('');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeOnTheScreen();
    });
  });
});
