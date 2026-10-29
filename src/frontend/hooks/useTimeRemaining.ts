import {defineMessages, useIntl} from 'react-intl';

import {getTimeRemaining} from '../lib/expiry';
import {useNow} from './useNow';

const m = defineMessages({
  hours: {
    id: 'hooks.useTimeRemaining.hours',
    defaultMessage: '{value, plural, one {# hour} other {# hours}}',
  },
  minutes: {
    id: 'hooks.useTimeRemaining.minutes',
    defaultMessage: '{value, plural, one {# minute} other {# minutes}}',
  },
  seconds: {
    id: 'hooks.useTimeRemaining.seconds',
    defaultMessage: '{value, plural, one {# second} other {# seconds}}',
  },
});

/** A ticking "3 hours" / "45 minutes" / "20 seconds" for an expiry countdown. */
export function useTimeRemaining(expiresAt: number): string {
  const {formatMessage: t} = useIntl();
  const now = useNow();

  const {unit, value} = getTimeRemaining(expiresAt - now);

  return t(m[unit], {value});
}
