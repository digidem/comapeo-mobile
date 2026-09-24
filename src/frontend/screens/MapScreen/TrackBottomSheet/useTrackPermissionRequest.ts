import {defineMessages, type MessageDescriptor} from 'react-intl';

import {
  useLocationPermission,
  useNotificationPermission,
} from '../../../hooks/usePermissions';

const m = defineMessages({
  title: {
    id: '$1screens.MapScreen.TrackBottomSheet.permissionTitle',
    defaultMessage: 'Record Tracks',
  },
  locationAndNotificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationAndNotificationsRequired',
    defaultMessage: 'Location & Notifications required to use.',
  },
  locationRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.locationRequired',
    defaultMessage: 'Location required to use.',
  },
  notificationsRequired: {
    id: 'screens.MapScreen.TrackBottomSheet.notificationsRequired',
    defaultMessage: 'Notifications required to use.',
  },
});

function requiredMessage({
  needsLocation,
  needsNotifications,
}: {
  needsLocation: boolean;
  needsNotifications: boolean;
}) {
  if (needsLocation && needsNotifications) {
    return m.locationAndNotificationsRequired;
  }
  return needsLocation ? m.locationRequired : m.notificationsRequired;
}

export type TrackPermissionRequest =
  | {status: 'pending'}
  | {status: 'granted'}
  | {
      status: 'needed';
      icon: 'hiking' | 'notifications';
      title: MessageDescriptor;
      description: MessageDescriptor;
      canAsk: boolean;
      allow: () => void;
      openSettings: () => void;
    };

/**
 * What tracking still needs before it can run, independent of how it's shown —
 * the track sheet renders this over the map, while the map screen renders it
 * full-size when there's no map to sit on because location was denied.
 */
export function useTrackPermissionRequest({
  enabled,
}: {
  enabled: boolean;
}): TrackPermissionRequest {
  const location = useLocationPermission({enabled});
  const notifications = useNotificationPermission({enabled});

  if (location.state === 'pending' || notifications.state === 'pending') {
    return {status: 'pending'};
  }

  if (location.state === 'granted' && notifications.state === 'granted') {
    return {status: 'granted'};
  }

  const needsLocation = location.state !== 'granted';
  const needsNotifications = notifications.state !== 'granted';

  return {
    status: 'needed',
    icon: needsLocation ? 'hiking' : 'notifications',
    title: m.title,
    description: requiredMessage({needsLocation, needsNotifications}),
    canAsk: location.state === 'askable' || notifications.state === 'askable',
    allow: async () => {
      if (location.state === 'askable') await location.request();
      if (notifications.state === 'askable') await notifications.request();
    },
    openSettings: location.openSettings,
  };
}
