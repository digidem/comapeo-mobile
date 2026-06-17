import {render, screen, fireEvent} from '@testing-library/react-native';

import {SelectOne} from './SelectOne';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
  {label: 'Option C', value: 'c'},
];

test('renders all option labels', () => {
  render(
    <SelectOne options={OPTIONS} updateTag={jest.fn()} tagValue={undefined} />,
  );

  expect(screen.getByText('Option A')).toBeOnTheScreen();
  expect(screen.getByText('Option B')).toBeOnTheScreen();
  expect(screen.getByText('Option C')).toBeOnTheScreen();
});

test('pressing an option calls updateTag with that value', () => {
  const updateTag = jest.fn();

  render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue={undefined} />,
  );

  fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith('b');
});

test('pressing the currently selected option still calls updateTag', () => {
  const updateTag = jest.fn();

  render(<SelectOne options={OPTIONS} updateTag={updateTag} tagValue="a" />);

  fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith('a');
});

test('pressing a different option replaces the selection', () => {
  const updateTag = jest.fn();

  render(<SelectOne options={OPTIONS} updateTag={updateTag} tagValue="a" />);

  fireEvent.press(screen.getByText('Option C'));

  expect(updateTag).toHaveBeenCalledWith('c');
  expect(updateTag).not.toHaveBeenCalledWith('a');
});

test('works when tagValue is undefined', () => {
  const updateTag = jest.fn();

  render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue={undefined} />,
  );

  fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith('a');
});
