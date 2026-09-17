import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {render, screen} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {MetricsResetWarningBottomSheet} from './MetricsResetWarningBottomSheet';
import type {AppStackParamsList} from '../../../sharedTypes/navigation';

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
});
