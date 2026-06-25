import * as React from 'react';
import {render, screen, fireEvent} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {DatePicker} from './Date';

function renderDatePicker(props: React.ComponentProps<typeof DatePicker>) {
  return render(
    <IntlProvider locale="en" messages={{}}>
      <DatePicker {...props} />
    </IntlProvider>,
  );
}

function todayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test('renders placeholder when tagValue is undefined', () => {
  renderDatePicker({updateTag: jest.fn(), tagValue: undefined});

  expect(screen.getByText('Date')).toBeOnTheScreen();
});

test('renders placeholder when tagValue is not an ISO date string', () => {
  renderDatePicker({updateTag: jest.fn(), tagValue: 'not-a-date'});

  expect(screen.getByText('Date')).toBeOnTheScreen();
});

test('renders formatted date when tagValue is a valid ISO date string', () => {
  // Build the tagValue and the expected text the same way the component
  // does (local midnight), so this test isn't sensitive to the runner's
  // timezone.
  const dateString = '2024-01-15';
  const localMidnight = new Date(dateString + 'T00:00:00');
  const tagValue = localMidnight.toISOString();
  const expectedText = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(localMidnight);

  renderDatePicker({updateTag: jest.fn(), tagValue});

  expect(screen.getByText(expectedText)).toBeOnTheScreen();
});

test('pressing the date input opens the calendar', () => {
  renderDatePicker({updateTag: jest.fn(), tagValue: undefined});

  expect(
    screen.queryByTestId(`FIELD.date-calendar.day_${todayDateString()}`),
  ).toBeNull();

  fireEvent.press(screen.getByTestId('OBS.DateInput'));

  expect(
    screen.getByTestId(`FIELD.date-calendar.day_${todayDateString()}`),
  ).toBeOnTheScreen();
});

test('selecting a day calls updateTag with that day as an ISO string', () => {
  const updateTag = jest.fn();
  renderDatePicker({updateTag, tagValue: undefined});

  fireEvent.press(screen.getByTestId('OBS.DateInput'));

  const dateString = todayDateString();
  fireEvent.press(screen.getByTestId(`FIELD.date-calendar.day_${dateString}`));

  expect(updateTag).toHaveBeenCalledWith(
    new Date(dateString + 'T00:00:00').toISOString(),
  );
});

test('selecting the already-selected day calls updateTag with null', () => {
  const updateTag = jest.fn();
  const dateString = todayDateString();
  const tagValue = new Date(dateString + 'T00:00:00').toISOString();

  renderDatePicker({updateTag, tagValue});

  fireEvent.press(screen.getByTestId('OBS.DateInput'));
  fireEvent.press(screen.getByTestId(`FIELD.date-calendar.day_${dateString}`));

  expect(updateTag).toHaveBeenCalledWith(null);
});
