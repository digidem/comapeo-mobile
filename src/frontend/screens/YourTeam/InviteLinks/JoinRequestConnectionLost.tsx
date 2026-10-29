import {defineMessages, useIntl} from 'react-intl';

import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
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
  close: {
    id: 'screens.YourTeam.JoinRequestConnectionLost.close',
    defaultMessage: 'Close',
  },
});

/** The coordinator's half of the invitee's "Connection Lost" */
export function JoinRequestConnectionLost({
  navigation,
}: NativeRootNavigationProps<'JoinRequestConnectionLost'>) {
  const {formatMessage: t} = useIntl();
  usePreventBackNavigation();

  return (
    <ScreenContentWithDock
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      dockContent={
        <SecondaryButton
          fullSize
          text={t(m.close)}
          onPress={() => navigation.popTo('YourTeam')}
        />
      }>
      <IconTitleDescription
        icon={
          <StatusCircleIcon
            icon={{name: 'wifi', color: BLUE_GREY}}
            badge={{color: WARNING_RED, name: 'priority-high'}}
            size={ICON_SIZE}
          />
        }
        title={t(m.connectionLost)}
        description={t(m.requestAgain)}
      />
    </ScreenContentWithDock>
  );
}
