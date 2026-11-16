import {render, screen, fireEvent} from '@testing-library/react-native';

import {SelectMultiple} from './SelectMultiple';

const OPTIONS = [
  {label: 'Option A', value: 'a'},
  {label: 'Option B', value: 'b'},
  {label: 'Option C', value: 'c'},
];

test('renders all option labels', async () => {
  await render(
    <SelectMultiple options={OPTIONS} updateTag={jest.fn()} tagValue={[]} />,
  );

  expect(screen.getByText('Option A')).toBeOnTheScreen();
  expect(screen.getByText('Option B')).toBeOnTheScreen();
  expect(screen.getByText('Option C')).toBeOnTheScreen();
});

test('selecting an unselected option adds it', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['a']} />,
  );

  await fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith(['a', 'b']);
});

test('selecting an already-selected option removes it', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectMultiple
      options={OPTIONS}
      updateTag={updateTag}
      tagValue={['a', 'b']}
    />,
  );

  await fireEvent.press(screen.getByText('Option A'));

  expect(updateTag).toHaveBeenCalledWith(['b']);
});

test('selecting the only selected option results in an empty array', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['b']} />,
  );

  await fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith([]);
});

test('works when tagValue is undefined', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectMultiple
      options={OPTIONS}
      updateTag={updateTag}
      tagValue={undefined}
    />,
  );

  await fireEvent.press(screen.getByText('Option C'));

  expect(updateTag).toHaveBeenCalledWith(['c']);
});

test('works when tagValue is a scalar string', async () => {
  const updateTag = jest.fn();

  await render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue="a" />,
  );

  await fireEvent.press(screen.getByText('Option B'));

  expect(updateTag).toHaveBeenCalledWith(['a', 'b']);
});

test('re-renders correctly when swapped to a field with duplicate labels', async () => {
  const DUPLICATE_LABEL_OPTIONS = [
    {label: 'Same', value: 'x'},
    {label: 'Same', value: 'y'},
  ];
  const NEXT_OPTIONS = [
    {label: 'Red', value: 'red'},
    {label: 'Blue', value: 'blue'},
  ];
  const updateTag = jest.fn();

  const {rerender} = await render(
    <SelectMultiple
      options={DUPLICATE_LABEL_OPTIONS}
      updateTag={updateTag}
      tagValue={[]}
    />,
  );

  await rerender(
    <SelectMultiple
      options={NEXT_OPTIONS}
      updateTag={updateTag}
      tagValue={[]}
    />,
  );

  expect(screen.getByText('Red')).toBeOnTheScreen();
  expect(screen.getByText('Blue')).toBeOnTheScreen();
  expect(screen.queryByText('Same')).toBeNull();
});

test('multiple options can be selected', async () => {
  const updateTag = jest.fn();
  const {rerender} = await render(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={[]} />,
  );

  await fireEvent.press(screen.getByText('Option A'));
  expect(updateTag).toHaveBeenLastCalledWith(['a']);

  await rerender(
    <SelectMultiple options={OPTIONS} updateTag={updateTag} tagValue={['a']} />,
  );

  await fireEvent.press(screen.getByText('Option C'));
  expect(updateTag).toHaveBeenLastCalledWith(['a', 'c']);
});
