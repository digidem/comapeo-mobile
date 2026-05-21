import {render, screen, fireEvent} from '@testing-library/react-native';

import {Number} from './Number';

test('renders with initial numeric value', () => {
  render(<Number updateTag={jest.fn()} tagValue={42} />);

  expect(screen.getByDisplayValue('42')).toBeOnTheScreen();
});

test('renders empty when tagValue is undefined', () => {
  render(<Number updateTag={jest.fn()} tagValue={undefined} />);

  expect(screen.getByDisplayValue('')).toBeOnTheScreen();
});

test('renders empty when tagValue is not a number', () => {
  render(<Number updateTag={jest.fn()} tagValue="not-a-number" />);

  expect(screen.getByDisplayValue('')).toBeOnTheScreen();
});

test('calls updateTag with parsed float on text change', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '3.14');

  expect(updateTag).toHaveBeenCalledWith(3.14);
});

test('strips non-numeric characters', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), 'abc123');

  expect(updateTag).toHaveBeenCalledWith(123);
});

test('handles negative numbers', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '-5');

  expect(updateTag).toHaveBeenCalledWith(-5);
});

test('removes a minus sign that is not at the start', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '1-2');

  expect(updateTag).toHaveBeenCalledWith(12);
});

test('removes extra decimal points', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '1.2.3');

  expect(updateTag).toHaveBeenCalledWith(1.23);
});
