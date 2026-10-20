import * as React from 'react';
import {Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';

import {
  HeaderRightIconContainer,
  HeaderRightIconContainerButton,
} from './HeaderRightContainer';

describe('HeaderRightIconContainerButton', () => {
  test('renders children and testID when not loading', async () => {
    await render(
      <HeaderRightIconContainerButton
        onPress={() => {}}
        loading={false}
        testID="header-button">
        <Text>Icon</Text>
      </HeaderRightIconContainerButton>,
    );

    expect(screen.getByTestId('header-button')).toBeOnTheScreen();
    expect(screen.getByText('Icon')).toBeOnTheScreen();
  });

  test('calls onPress when pressed and not loading', async () => {
    const onPress = jest.fn();
    await render(
      <HeaderRightIconContainerButton onPress={onPress} loading={false}>
        <Text>Icon</Text>
      </HeaderRightIconContainerButton>,
    );

    await fireEvent.press(screen.getByText('Icon'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('shows a loading indicator and hides children when loading', async () => {
    const onPress = jest.fn();
    await render(
      <HeaderRightIconContainerButton
        onPress={onPress}
        loading={true}
        testID="header-button">
        <Text>Icon</Text>
      </HeaderRightIconContainerButton>,
    );

    expect(screen.getByTestId('header-button')).toBeOnTheScreen();
    expect(screen.queryByText('Icon')).not.toBeOnTheScreen();
  });
});

describe('HeaderRightIconContainer', () => {
  test('renders children and testID', async () => {
    await render(
      <HeaderRightIconContainer testID="header-container">
        <Text>Icon</Text>
      </HeaderRightIconContainer>,
    );

    expect(screen.getByTestId('header-container')).toBeOnTheScreen();
    expect(screen.getByText('Icon')).toBeOnTheScreen();
  });

  test('renders with no children', async () => {
    await render(<HeaderRightIconContainer testID="header-container" />);

    expect(screen.getByTestId('header-container')).toBeOnTheScreen();
  });
});
