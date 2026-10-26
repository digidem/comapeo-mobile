import {defineMessages, useIntl} from 'react-intl';

import {InviteLinkError} from '../../../sharedComponents/InviteLinkError';
import {StatusCircleIcon} from '../../../sharedComponents/StatusCircleIcon';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import {BLUE_GREY, WARNING_RED} from '../../../lib/styles';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const ICON_SIZE = 100;

const m = defineMessages({
  connectionLost: {
    id: 'screens.YourTeam.JoinRequestConnectionLost.connectionLost',
    defaultMessage: 'Requesting Device Lost Connection',
  },
  requestAgain: {
    id: 'screens.YourTeam.JoinRequestConnectionLost.requestAgain',
    defaultMessage: 'Device can request again using the same link.',
  },
});

/** The coordinator's half of the invitee's "Connection Lost" */
export function JoinRequestConnectionLost({
  navigation,
}: NativeRootNavigationProps<'JoinRequestConnectionLost'>) {
  const {formatMessage: t} = useIntl();
  usePreventBackNavigation();

  return (
    <InviteLinkError
      icon={
        <StatusCircleIcon
          icon={{name: 'wifi', color: BLUE_GREY}}
          badge={{color: WARNING_RED, name: 'priority-high'}}
          size={ICON_SIZE}
        />
      }
      title={t(m.connectionLost)}
      description={t(m.requestAgain)}
      onClose={() => navigation.popTo('YourTeam')}
    />
  );
}
