import {render, screen, fireEvent} from '@testing-library/react-native';

import {Number} from './Number';

test('renders with initial numeric value', () => {
  render(<Number updateTag={jest.fn()} tagValue={42} />);

  expect(screen.getByDisplayValue('42')).toBeOnTheScreen();
});

test('renders empty when tagValue is undefined', () => {
  render(<Number updateTag={jest.fn()} tagValue={undefined} />);

  expect(screen.getByTestId('OBS.number-inp').props.value).toBe('');
});

test('renders empty when tagValue is not a number', () => {
  render(<Number updateTag={jest.fn()} tagValue={null} />);

  expect(screen.getByTestId('OBS.number-inp').props.value).toBe('');
});

test('calls updateTag with a number when tagValue is a numeric string', () => {
  const updateTag = jest.fn();
  render(<Number updateTag={updateTag} tagValue="1.77" />);

  expect(screen.getByDisplayValue('1.77')).toBeVisible();

  fireEvent.changeText(screen.getByDisplayValue('1.77'), '1.777');

  //should be a number now
  expect(updateTag).toHaveBeenCalledWith(1.777);
});

test('calls updateTag with parsed float on text change', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);
  fireEvent.changeText(screen.getByDisplayValue(''), '3.14');

  expect(screen.getByDisplayValue('3.14')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(3.14);
});

test('strips non-numeric characters', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  expect(screen.getByDisplayValue('')).toBeVisible();

  fireEvent.changeText(screen.getByDisplayValue(''), 'a');

  //user should not see strings
  expect(screen.getByDisplayValue('')).toBeVisible();

  //update tag should be called with null
  expect(updateTag).toHaveBeenCalledWith(null);

  fireEvent.changeText(screen.getByDisplayValue(''), 'abc123');

  expect(screen.getByDisplayValue('123')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(123);
});

test('handles negative numbers', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '-5');

  expect(screen.getByDisplayValue('-5')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(-5);
});

test('removes a minus sign that is not at the start', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '1-2');

  expect(screen.getByDisplayValue('12')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(12);
});

test('removes extra decimal points', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '1.2.3');

  expect(screen.getByDisplayValue('1.23')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(1.23);
});

test('checks minus returns undefined but still shows the negative sign on the screen', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '-');

  expect(screen.getByDisplayValue('-')).toBeVisible();

  expect(updateTag).not.toHaveBeenCalled();
});

test('checks decimal', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '.');

  expect(screen.getByDisplayValue('0.')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(0);
});

test('handles 0', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '0');

  expect(screen.getByDisplayValue('0')).toBeVisible();

  expect(updateTag).toHaveBeenCalledWith(0);
});

test('handles -0{someNumber}', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '-05');

  expect(screen.getByTestId('OBS.number-inp').props.value).toBe('-5');

  expect(updateTag).toHaveBeenCalledWith(-5);
});

test('handles -0', () => {
  const updateTag = jest.fn();

  render(<Number updateTag={updateTag} tagValue={undefined} />);

  fireEvent.changeText(screen.getByDisplayValue(''), '-0');

  expect(screen.getByTestId('OBS.number-inp').props.value).toBe('-0');

  expect(updateTag).toHaveBeenCalledWith(0);
});
