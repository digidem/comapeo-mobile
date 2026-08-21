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
import type {AppVariant} from '../lib/appVariant';

jest.mock('../images/Error.svg', () => 'ErrorIcon');
jest.mock('../images/chevrondown.svg', () => 'ChevronDown');
jest.mock('../images/chevrondown-expanded.svg', () => 'ChevronUp');
jest.mock('./BottomSheetWrapper', () => ({
  BottomSheetWrapper: ({children}: {children: React.ReactNode}) => children,
}));
jest.mock('../lib/appVariant', () => ({
  APP_VARIANT: 'production' as AppVariant,
  isQABuild: false,
}));
jest.mock('../contexts/QADeviceNameStoreContext', () => ({
  useQADeviceName: () => null,
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
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();
    });
  });

  it('should render Advanced button', async () => {
    const error = new Error('Test error message');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });
  });

  it('should not show error details initially', async () => {
    const error = new Error('Test error message');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    expect(screen.queryByText('Test error message')).not.toBeOnTheScreen();
  });

  it('should show error details when Advanced is clicked', async () => {
    const error = new Error('Test error message');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    await fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/Test error message/)).toBeOnTheScreen();
    });
  });

  it('should hide error details when Advanced is clicked again', async () => {
    const error = new Error('Test error message');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');

    await fireEvent.press(advancedButton);
    await waitFor(() => {
      expect(screen.getByText(/Test error message/)).toBeOnTheScreen();
    });

    await fireEvent.press(advancedButton);
    await waitFor(() => {
      expect(screen.queryByText('Test error message')).not.toBeOnTheScreen();
    });
  });

  it('should display error code when available', async () => {
    const error = new Error('Test error message') as Error & {code?: string};
    error.code = 'INVITE_ABORTED';
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    await fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/INVITE_ABORTED/)).toBeOnTheScreen();
    });
  });

  it('should display error stack trace when available', async () => {
    const error = new Error('Detailed error message');
    error.stack =
      'Error: Detailed error message\n    at TestFunction (test.ts:10:5)';
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    await fireEvent.press(advancedButton);

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

    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    await fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/INVITE_ABORTED/)).toBeOnTheScreen();
      expect(screen.getByText(/InviteManager/)).toBeOnTheScreen();
    });
  });

  it('should render Close button', async () => {
    const error = new Error('Test error');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Close')).toBeOnTheScreen();
    });
  });

  it('should handle error with empty message', async () => {
    const error = new Error('');
    await render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Advanced')).toBeOnTheScreen();
    });

    const advancedButton = screen.getByText('Advanced');
    await fireEvent.press(advancedButton);

    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeOnTheScreen();
    });
  });

  it('should not show QA info section in production builds', async () => {
    const error = new Error('Test error');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeOnTheScreen();
    });

    expect(screen.queryByTestId('EBS.qa-info-section')).not.toBeOnTheScreen();
  });
});

describe('ErrorBottomSheet in QA builds', () => {
  const appVariantModule = jest.requireMock('../lib/appVariant') as {
    APP_VARIANT: AppVariant;
    isQABuild: boolean;
  };
  const qaDeviceNameModule = jest.requireMock(
    '../contexts/QADeviceNameStoreContext',
  ) as {useQADeviceName: () => string | null};

  afterEach(() => {
    appVariantModule.isQABuild = false;
    qaDeviceNameModule.useQADeviceName = () => null;
  });

  it('shows UTC timestamp and QA device name in QA builds', async () => {
    appVariantModule.isQABuild = true;
    qaDeviceNameModule.useQADeviceName = () => 'my-qa-device';

    const error = new Error('Test error');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(screen.getByTestId('EBS.qa-info-section')).toBeOnTheScreen();
    });

    expect(screen.getByText(/UTC/)).toBeOnTheScreen();
    expect(screen.getByText('my-qa-device')).toBeOnTheScreen();
  });

  it('timestamp matches UTC format MMM D, H:MM:SS AM/PM UTC', async () => {
    appVariantModule.isQABuild = true;
    qaDeviceNameModule.useQADeviceName = () => null;

    const error = new Error('Test error');
    render(<TestNavigator error={error} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /^[A-Z][a-z]{2} \d{1,2}, \d{1,2}:\d{2}:\d{2} (AM|PM) UTC$/,
        ),
      ).toBeOnTheScreen();
    });
  });
});
