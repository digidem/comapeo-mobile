import {render, screen, fireEvent} from '@testing-library/react-native';

import {TextArea} from './TextArea';

test('renders with initial string value', async () => {
  await render(<TextArea updateTag={jest.fn()} tagValue="hello" />);

  expect(screen.getByDisplayValue('hello')).toBeOnTheScreen();
});

test('renders empty when tagValue is undefined', async () => {
  await render(<TextArea updateTag={jest.fn()} tagValue={undefined} />);

  expect(screen.getByDisplayValue('')).toBeOnTheScreen();
});

test('renders empty when tagValue is not a string', async () => {
  await render(<TextArea updateTag={jest.fn()} tagValue={42} />);

  expect(screen.getByDisplayValue('')).toBeOnTheScreen();
});

test('calls updateTag with new text on change', async () => {
  const updateTag = jest.fn();

  await render(<TextArea updateTag={updateTag} tagValue="" />);

  await fireEvent.changeText(screen.getByDisplayValue(''), 'new text');

  expect(updateTag).toHaveBeenCalledWith('new text');
});

test('calls updateTag with empty string when cleared', async () => {
  const updateTag = jest.fn();

  await render(<TextArea updateTag={updateTag} tagValue="some text" />);

  await fireEvent.changeText(screen.getByDisplayValue('some text'), '');

  expect(updateTag).toHaveBeenCalledWith('');
});
