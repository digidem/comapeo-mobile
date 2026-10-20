import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import {defineMessages, type IntlShape} from 'react-intl';

// This is for iOS as Android's notification imperatively comes through the location foreground service.
const TRACKING_NOTIFICATION_ID = 'comapeo-tracks-recording';

export const trackingNotificationMessages = defineMessages({
  title: {
    id: '$1lib.trackingNotification.title',
    defaultMessage: 'CoMapeo Tracks Recording',
  },
  subtitle: {
    id: '$1lib.trackingNotification.subtitle',
    defaultMessage: 'View real-time Tracks progress.',
  },
  description: {
    id: '$1lib.trackingNotification.description',
    defaultMessage:
      'CoMapeo is using location to record real-time progress on Tracks. Data remains on this device only and could affect its storage. To stop recording, open CoMapeo, tap Tracks, and then tap End.',
  },
});

export async function showTrackingNotification(
  formatMessage: IntlShape['formatMessage'],
) {
  if (Platform.OS !== 'ios') return;

  // only continue if there is not a notification currently posted
  const presented = await Notifications.getPresentedNotificationsAsync();
  if (
    presented.some(
      ({request}) => request.identifier === TRACKING_NOTIFICATION_ID,
    )
  ) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: TRACKING_NOTIFICATION_ID,
    content: {
      title: formatMessage(trackingNotificationMessages.title),
      subtitle: formatMessage(trackingNotificationMessages.subtitle),
      body: formatMessage(trackingNotificationMessages.description),
    },
    trigger: null,
  });
}

export async function hideTrackingNotification() {
  if (Platform.OS !== 'ios') return;

  await Notifications.dismissNotificationAsync(TRACKING_NOTIFICATION_ID);
}
