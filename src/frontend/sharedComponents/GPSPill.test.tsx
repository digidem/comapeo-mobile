import {render, screen} from '@testing-library/react-native';

import {GPSPill} from './GPSPill';

test.skip('searching status', async () => {
  render(<GPSPill status="searching" />);

  // TODO: Check icon color
});

test('error status', async () => {
  render(<GPSPill status="error" />);

  expect(screen.getByText('--')).toBeOnTheScreen();

  // TODO: Check icon color
});

test('good status', async () => {
  render(<GPSPill status="good" accuracy={1} />);

  expect(screen.getByText('± 1 m')).toBeOnTheScreen();

  // TODO: Check icon color
});

test('displayed accuracy', async () => {
  // Handles integers
  render(<GPSPill status="good" accuracy={10} />);
  expect(screen.getByText('± 10 m')).toBeOnTheScreen();

  // Handles negative accuracy elegantly
  render(<GPSPill status="good" accuracy={-1} />);
  expect(screen.getByText('± 1 m')).toBeOnTheScreen();

  // Handles floats
  render(<GPSPill status="good" accuracy={0.5} />);
  expect(screen.getByText('± 1 m')).toBeOnTheScreen();

  render(<GPSPill status="good" accuracy={5.25} />);
  expect(screen.getByText('± 5 m')).toBeOnTheScreen();

  render(<GPSPill status="good" accuracy={10.75} />);
  expect(screen.getByText('± 11 m')).toBeOnTheScreen();
});
