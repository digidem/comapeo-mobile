import {render, screen, fireEvent} from '@testing-library/react-native';

import {SelectOne} from './SelectOne';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
  {label: 'Option C', value: 'c'},
];

test('renders all option labels', async () => {
  await render(
    <SelectOne options={OPTIONS} updateTag={jest.fn()} tagValue={undefined} />,
  );

  expect(screen.getByText('Option A')).toBeOnTheScreen();
  expect(screen.getByText('Option B')).toBeOnTheScreen();
  expect(screen.getByText('Option C')).toBeOnTheScreen();
});

test('pressing an option calls updateTag with that value', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue={undefined} />,
  );

  await fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith('b');
});

test('pressing the currently selected option still calls updateTag', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue="a" />,
  );

  await fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith('a');
});

test('pressing a different option replaces the selection', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue="a" />,
  );

  await fireEvent.press(screen.getByText('Option C'));

  expect(updateTag).toHaveBeenCalledWith('c');
  expect(updateTag).not.toHaveBeenCalledWith('a');
});

test('works when tagValue is undefined', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectOne options={OPTIONS} updateTag={updateTag} tagValue={undefined} />,
  );

  await fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith('a');
});

test('options with duplicate labels each save their own distinct value when pressed', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectOne
      options={[
        {label: '00PM', value: 'Cap Start - 12'},
        {label: '00PM', value: 'Cap End - 12'},
      ]}
      updateTag={updateTag}
      tagValue={undefined}
    />,
  );

  const matches = screen.getAllByText('00PM');
  await fireEvent.press(matches[0]!);
  expect(updateTag).toHaveBeenLastCalledWith('Cap Start - 12');

  await fireEvent.press(matches[1]!);
  expect(updateTag).toHaveBeenLastCalledWith('Cap End - 12');
});

// Duplicate labels (but distinct values) caused stale options to bleed into the
// next field when navigating between questions. Real-world example: a
// camera-settings field with two "00PM" options ("Cap Start - 12" / "Cap End - 12").
test('re-renders correctly when swapped to a field with duplicate labels', async () => {
  const CAMERA_SETTINGS_OPTIONS = [
    {label: 'MultiShot - RPF2Shot', value: 'multishot-rpf2shot'},
    {label: '00PM', value: 'Cap Start - 12'},
    {label: '00PM', value: 'Cap End - 12'},
    {label: 'Smart IR - On', value: 'smart-ir-on'},
  ];
  const NEXT_OPTIONS = [
    {label: 'Option A', value: 'a'},
    {label: 'Option B', value: 'b'},
  ];
  const updateTag = jest.fn();

  const {rerender} = await render(
    <SelectOne
      options={CAMERA_SETTINGS_OPTIONS}
      updateTag={updateTag}
      tagValue={undefined}
    />,
  );

  await rerender(
    <SelectOne
      options={NEXT_OPTIONS}
      updateTag={updateTag}
      tagValue={undefined}
    />,
  );

  expect(screen.getByText('Option A')).toBeOnTheScreen();
  expect(screen.getByText('Option B')).toBeOnTheScreen();
  expect(screen.queryByText('00PM')).toBeNull();
  expect(screen.queryByText('MultiShot - RPF2Shot')).toBeNull();
  expect(screen.queryByText('Smart IR - On')).toBeNull();
});
