import * as React from 'react';
import {render, screen, userEvent} from '@testing-library/react-native';
import {IntlProvider} from 'react-intl';

import {TrackSheetContent} from './TrackSheetContent';
import type {Permission, PermissionState} from '../../../hooks/usePermissions';

jest.mock('./StartStopTrack', () => {
  const {Text} = jest.requireActual('react-native');
  const StartStopTrack = () => <Text>Start Stop Track</Text>;
  return {StartStopTrack};
});

const mockLocation = jest.fn<Permission, []>();
const mockNotifications = jest.fn<Permission, []>();

jest.mock('../../../hooks/usePermissions', () => ({
  useLocationPermission: () => mockLocation(),
  useNotificationPermission: () => mockNotifications(),
}));

function permission(state: PermissionState): Permission {
  return {
    state,
    request: jest.fn(() => Promise.resolve()),
    openSettings: jest.fn(() => Promise.resolve()),
  };
}

function renderSheet({
  location,
  notifications,
}: {
  location: Permission;
  notifications: Permission;
}) {
  mockLocation.mockReturnValue(location);
  mockNotifications.mockReturnValue(notifications);

  return render(
    <IntlProvider locale="en" messages={{}}>
      <TrackSheetContent isOpen />
    </IntlProvider>,
  );
}

test('both granted shows the tracking controls', async () => {
  await renderSheet({
    location: permission('granted'),
    notifications: permission('granted'),
  });

  expect(screen.getByText('Start Stop Track')).toBeOnTheScreen();
});

test('neither granted asks for both', async () => {
  await renderSheet({
    location: permission('askable'),
    notifications: permission('askable'),
  });

  expect(screen.getByText('Record Tracks')).toBeOnTheScreen();
  expect(
    screen.getByText('Location & Notifications required to use.'),
  ).toBeOnTheScreen();
  expect(screen.getByTestId('TRACK.permission-allow-btn')).toBeOnTheScreen();
});

test('only location missing asks for location alone', async () => {
  await renderSheet({
    location: permission('askable'),
    notifications: permission('granted'),
  });

  expect(screen.getByText('Location required to use.')).toBeOnTheScreen();
});

test('only notifications missing asks for notifications alone', async () => {
  await renderSheet({
    location: permission('granted'),
    notifications: permission('askable'),
  });

  expect(screen.getByText('Notifications required to use.')).toBeOnTheScreen();
});

test('allow asks for location before notifications', async () => {
  const user = userEvent.setup();
  const location = permission('askable');
  const notifications = permission('askable');
  const order: string[] = [];
  (location.request as jest.Mock).mockImplementation(async () => {
    order.push('location');
  });
  (notifications.request as jest.Mock).mockImplementation(async () => {
    order.push('notifications');
  });

  await renderSheet({location, notifications});
  await user.press(screen.getByTestId('TRACK.permission-allow-btn'));

  expect(order).toEqual(['location', 'notifications']);
});

test('allow skips a permission the system will no longer prompt for', async () => {
  const user = userEvent.setup();
  const location = permission('blocked');
  const notifications = permission('askable');

  await renderSheet({location, notifications});
  await user.press(screen.getByTestId('TRACK.permission-allow-btn'));

  expect(location.request).not.toHaveBeenCalled();
  expect(notifications.request).toHaveBeenCalled();
});

test('offers settings once nothing can be asked for again', async () => {
  const user = userEvent.setup();
  const location = permission('blocked');
  const notifications = permission('blocked');

  await renderSheet({location, notifications});

  expect(screen.queryByTestId('TRACK.permission-allow-btn')).toBeNull();
  await user.press(screen.getByTestId('TRACK.permission-settings-btn'));

  expect(location.openSettings).toHaveBeenCalled();
});
