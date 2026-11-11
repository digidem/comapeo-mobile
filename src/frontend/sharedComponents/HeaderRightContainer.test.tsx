import * as React from 'react';
import {Text} from 'react-native';
import {render, screen, fireEvent} from '@testing-library/react-native';

import {
  HeaderRightContainer,
  HeaderRightContainerButton,
} from './HeaderRightContainer';

describe('HeaderRightIconContainerButton', () => {
  test('renders children and testID when not loading', async () => {
    await render(
      <HeaderRightContainerButton
        onPress={() => {}}
        loading={false}
        testID="header-button">
        <Text>Icon</Text>
      </HeaderRightContainerButton>,
    );

    expect(screen.getByTestId('header-button')).toBeOnTheScreen();
    expect(screen.getByText('Icon')).toBeOnTheScreen();
  });

  test('calls onPress when pressed and not loading', async () => {
    const onPress = jest.fn();
    await render(
      <HeaderRightContainerButton onPress={onPress} loading={false}>
        <Text>Icon</Text>
      </HeaderRightContainerButton>,
    );

    await fireEvent.press(screen.getByText('Icon'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('shows a loading indicator and hides children when loading', async () => {
    const onPress = jest.fn();
    await render(
      <HeaderRightContainerButton
        onPress={onPress}
        loading={true}
        testID="header-button">
        <Text>Icon</Text>
      </HeaderRightContainerButton>,
    );

    expect(screen.getByTestId('header-button')).toBeOnTheScreen();
    expect(screen.queryByText('Icon')).not.toBeOnTheScreen();
  });
});

describe('HeaderRightIconContainer', () => {
  test('renders children and testID', async () => {
    await render(
      <HeaderRightContainer testID="header-container">
        <Text>Icon</Text>
      </HeaderRightContainer>,
    );

    expect(screen.getByTestId('header-container')).toBeOnTheScreen();
    expect(screen.getByText('Icon')).toBeOnTheScreen();
  });

  test('renders with no children', async () => {
    await render(<HeaderRightContainer testID="header-container" />);

    expect(screen.getByTestId('header-container')).toBeOnTheScreen();
  });
});
