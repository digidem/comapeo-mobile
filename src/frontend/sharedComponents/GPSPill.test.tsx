import {render, screen} from '@testing-library/react-native';

import {DARK_GREY, DARK_MAGENTA, GREEN, WARNING_RED} from '../lib/styles';
import {GPSPill} from './GPSPill';

test('searching status', async () => {
  render(
    <GPSPill status="searching" testID="gps-pill" iconTestID="gps-pill-icon" />,
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
    <GPSPill status="error" testID="gps-pill" iconTestID="gps-pill-icon" />,
  );

  expect(screen.getByText('--')).toBeOnTheScreen();

  expect(screen.getByTestId('gps-pill')).toHaveStyle({
    backgroundColor: WARNING_RED,
  });

  expect(screen.getByTestId('gps-pill-icon')).toHaveStyle({
    backgroundColor: DARK_MAGENTA,
  });
});

test('good status', async () => {
  render(
    <GPSPill
      status="good"
      accuracy={1}
      testID="gps-pill"
      iconTestID="gps-pill-icon"
    />,
  );

  expect(screen.getByText('1 ±')).toBeOnTheScreen();

  expect(screen.getByTestId('gps-pill')).toHaveStyle({
    backgroundColor: DARK_GREY,
  });

  expect(screen.getByTestId('gps-pill-icon')).toHaveStyle({
    backgroundColor: GREEN,
  });
});

test('displayed accuracy', async () => {
  // Handles integers
  render(<GPSPill status="good" accuracy={10} />);
  expect(screen.getByText('10 ±')).toBeOnTheScreen();

  // Handles negative accuracy elegantly
  render(<GPSPill status="good" accuracy={-1} />);
  expect(screen.getByText('1 ±')).toBeOnTheScreen();

  // Handles floats
  render(<GPSPill status="good" accuracy={0.5} />);
  expect(screen.getByText('1 ±')).toBeOnTheScreen();

  render(<GPSPill status="good" accuracy={5.25} />);
  expect(screen.getByText('5 ±')).toBeOnTheScreen();

  render(<GPSPill status="good" accuracy={10.75} />);
  expect(screen.getByText('11 ±')).toBeOnTheScreen();
});
