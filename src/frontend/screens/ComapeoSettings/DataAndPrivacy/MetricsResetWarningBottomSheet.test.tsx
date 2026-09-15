import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';
import RNRestart from 'react-native-restart';

import {MetricsResetWarningBottomSheet} from './MetricsResetWarningBottomSheet';
import type {AppStackParamsList} from '../../../sharedTypes/navigation';

jest.mock('react-native-restart', () => ({restart: jest.fn()}));
jest.mock('../../../sharedComponents/BottomSheetWrapper', () => ({
  BottomSheetWrapper: ({children}: {children: React.ReactNode}) => children,
}));

const Stack = createNativeStackNavigator<AppStackParamsList>();

function TestNavigator(params: AppStackParamsList['MetricsResetWarning']) {
  return (
    <IntlProvider locale="en" messages={{}}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="MetricsResetWarning"
            component={MetricsResetWarningBottomSheet}
            initialParams={params}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </IntlProvider>
  );
}

describe('MetricsResetWarningBottomSheet', () => {
  it('says sharing will turn ON', async () => {
    await render(<TestNavigator metric="appUsage" sharing="on" />);
    expect(screen.getByText('Sharing will turn ON.')).toBeOnTheScreen();
  });

  it('says sharing will turn OFF', async () => {
    await render(<TestNavigator metric="diagnostics" sharing="off" />);
    expect(screen.getByText('Sharing will turn OFF.')).toBeOnTheScreen();
  });

  it('restarts the app when Reset Now is pressed', async () => {
    await render(<TestNavigator metric="diagnostics" sharing="on" />);
    await fireEvent.press(screen.getByTestId('MRW.reset-now-btn'));
    expect(RNRestart.restart).toHaveBeenCalled();
  });
});
