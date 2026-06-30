import {render, screen} from '@testing-library/react-native';

import {DARK_GREY, DARK_MAGENTA, GREEN, WARNING_RED} from '../../lib/styles';
import {GPSPillUI} from './GPSPillUI';

test('searching status', async () => {
  render(
    <GPSPillUI
      status="searching"
      unitSystem="metric"
      testID="gps-pill"
      iconTestID="gps-pill-icon"
    />,
  );

  expect(screen.getByText('--')).toBeOnTheScreen();

  expect(screen.getByTestId('gps-pill')).toHaveStyle({
    backgroundColor: DARK_GREY,
  });

  // Kind of hard to do a better assertion for this in this case.
  expect(screen.getByTestId('gps-pill-icon')).toBeOnTheScreen();
});

test('error status', async () => {
  render(
    <GPSPillUI
      status="error"
      unitSystem="metric"
      testID="gps-pill"
      iconTestID="gps-pill-icon"
    />,
  );

  expect(screen.getByText('--')).toBeOnTheScreen();

  expect(screen.getByTestId('gps-pill')).toHaveStyle({
    backgroundColor: WARNING_RED,
  });

  expect(screen.getByTestId('gps-pill-icon')).toHaveStyle({
    backgroundColor: DARK_MAGENTA,
  });
});

test('good status - metric', async () => {
  render(
    <GPSPillUI
      status="good"
      accuracy={1}
      unitSystem="metric"
      testID="gps-pill"
      iconTestID="gps-pill-icon"
    />,
  );

  expect(screen.getByText('±1 m')).toBeOnTheScreen();

  expect(screen.getByTestId('gps-pill')).toHaveStyle({
    backgroundColor: DARK_GREY,
  });

  expect(screen.getByTestId('gps-pill-icon')).toHaveStyle({
    backgroundColor: GREEN,
  });
});

test('good status - imperial', async () => {
  render(
    <GPSPillUI
      status="good"
      accuracy={1}
      unitSystem="imperial"
      testID="gps-pill"
      iconTestID="gps-pill-icon"
    />,
  );

  // 1m * 3.28084 = 3.28084, rounds to 3
  expect(screen.getByText('±3 ft')).toBeOnTheScreen();
});

test('displayed accuracy - metric', async () => {
  render(<GPSPillUI status="good" accuracy={10} unitSystem="metric" />);
  expect(screen.getByText('±10 m')).toBeOnTheScreen();

  render(<GPSPillUI status="good" accuracy={-1} unitSystem="metric" />);
  expect(screen.getByText('±1 m')).toBeOnTheScreen();

  render(<GPSPillUI status="good" accuracy={0.5} unitSystem="metric" />);
  expect(screen.getByText('±1 m')).toBeOnTheScreen();

  render(<GPSPillUI status="good" accuracy={5.25} unitSystem="metric" />);
  expect(screen.getByText('±5 m')).toBeOnTheScreen();

  render(<GPSPillUI status="good" accuracy={10.75} unitSystem="metric" />);
  expect(screen.getByText('±11 m')).toBeOnTheScreen();
});

test('displayed accuracy - imperial', async () => {
  // 10m * 3.28084 = 32.8084, rounds to 33
  render(<GPSPillUI status="good" accuracy={10} unitSystem="imperial" />);
  expect(screen.getByText('±33 ft')).toBeOnTheScreen();

  // 5m * 3.28084 = 16.4042, rounds to 16
  render(<GPSPillUI status="good" accuracy={5} unitSystem="imperial" />);
  expect(screen.getByText('±16 ft')).toBeOnTheScreen();
});
