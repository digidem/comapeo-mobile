import {render, screen} from '@testing-library/react-native';

import {GPSPill} from './GPSPill';

test('searching', async () => {
  render(<GPSPill status="searching" />);

  // TODO: Check icon color?
});

test('error', async () => {
  render(<GPSPill status="error" />);

  expect(screen.getByTestId('MAP.gps-pill-text')).toHaveTextContent('--');

  // TODO: Check icon color?
});

test('good', async () => {
  render(<GPSPill status="good" accuracy={1} />);

  expect(screen.getByTestId('MAP.gps-pill-text')).toHaveTextContent('± 1 m');

  // TODO: Check icon color?
});

test('displayed accuracy', async () => {
  render(<GPSPill status="good" accuracy={10} />);

  expect(screen.getByTestId('MAP.gps-pill-text')).toHaveTextContent('± 10 m');

  render(<GPSPill status="good" accuracy={-10} />);

  expect(screen.getByTestId('MAP.gps-pill-text')).toHaveTextContent('± 10 m');

  render(<GPSPill status="good" accuracy={0.5} />);

  expect(screen.getByTestId('MAP.gps-pill-text')).toHaveTextContent('± 0.5 m');
});
