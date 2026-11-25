import {useEffect} from 'react';
import {AppState} from 'react-native';
import {useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import {useTrackState} from '../contexts/TrackStoreContext';
import {showIOSTrackingNotification} from '../lib/trackingNotification';

/**
 * iOS removes the tracking notification as soon as it is tapped, so this puts it back
 * when the app goes to the background while still tracking. Does nothing on Android,
 * where the foreground service keeps its own notification up.
 */
export function useReshowTrackingNotification() {
  const {formatMessage} = useIntl();
  const isTracking = useTrackState(state => state.isTracking);

  useEffect(() => {
    if (!isTracking) return;

    const subscription = AppState.addEventListener('change', status => {
      if (status !== 'background') return;

      showIOSTrackingNotification(formatMessage).catch(err =>
        Sentry.captureException(err),
      );
    });

    return () => subscription.remove();
  }, [isTracking, formatMessage]);
}
