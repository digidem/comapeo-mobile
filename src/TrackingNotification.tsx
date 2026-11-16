import * as React from 'react';
import {AppState} from 'react-native';
import {useIntl} from 'react-intl';
import * as Sentry from '@sentry/react-native';

import {useTrackState} from './contexts/TrackStoreContext';
import {showTrackingNotification} from './lib/trackingNotification';

/**
 * Puts the tracking notification back after it is removed (on iOS), which it does as
 * soon as the notification is tapped.
 */
export const TrackingNotification = () => {
  const {formatMessage} = useIntl();
  const isTracking = useTrackState(state => state.isTracking);

  React.useEffect(() => {
    if (!isTracking) return;

    const subscription = AppState.addEventListener('change', status => {
      if (status !== 'background') return;

      showTrackingNotification(formatMessage).catch(err =>
        Sentry.captureException(err),
      );
    });

    return () => subscription.remove();
  }, [isTracking, formatMessage]);

  return null;
};
