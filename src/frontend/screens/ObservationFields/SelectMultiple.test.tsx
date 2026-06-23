import {render, screen, fireEvent} from '@testing-library/react-native';

import {SelectMultiple} from './SelectMultiple';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
  {label: 'Option C', value: 'c'},
];

test('renders all option labels', () => {
  render(
    <SelectMultiple options={OPTIONS} updateTag={jest.fn()} tagValue={[]} />,
  );

  expect(screen.getByText('Option A')).toBeOnTheScreen();
  expect(screen.getByText('Option B')).toBeOnTheScreen();
  expect(screen.getByText('Option C')).toBeOnTheScreen();
});

test('selecting an unselected option adds it', () => {
  const updateTag = jest.fn();

  render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['a']} />,
  );

  fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith(['a', 'b']);
});

test('selecting an already-selected option removes it', () => {
  const updateTag = jest.fn();

  render(
    <SelectMultiple
      options={OPTIONS}
      updateTag={updateTag}
      tagValue={['a', 'b']}
    />,
  );

  fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith(['b']);
});

test('selecting the only selected option results in an empty array', () => {
  const updateTag = jest.fn();

  render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['b']} />,
  );

  fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith([]);
});

test('works when tagValue is undefined', () => {
  const updateTag = jest.fn();

  render(
    <SelectMultiple
      options={OPTIONS}
      updateTag={updateTag}
      tagValue={undefined}
    />,
  );

  fireEvent.press(screen.getByText('Option C'));

  expect(updateTag).toHaveBeenCalledWith(['c']);
});

test('works when tagValue is a scalar string', () => {
  const updateTag = jest.fn();

  render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue="a" />,
  );

  fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith(['a', 'b']);
});

test('multiple options can be selected', () => {
  const updateTag = jest.fn();
  const {rerender} = render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={[]} />,
  );

  fireEvent.press(screen.getByText('Option A'));
  expect(updateTag).toHaveBeenLastCalledWith(['a']);

  rerender(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['a']} />,
  );

  fireEvent.press(screen.getByText('Option C'));
  expect(updateTag).toHaveBeenLastCalledWith(['a', 'c']);
});
