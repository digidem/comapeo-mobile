import * as React from 'react';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';

import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import SuccessCheck from '../../../images/Success.svg';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const ICON_SIZE = 100;

const m = defineMessages({
  accepted: {
    id: 'screens.YourTeam.JoinRequestAccepted.accepted',
    defaultMessage: 'Accepted!',
  },
  joinedProject: {
    id: 'screens.YourTeam.JoinRequestAccepted.joinedProject',
    defaultMessage:
      '<bold>{deviceName}</bold> joined project <bold>{projectName}</bold>',
  },
  close: {
    id: 'screens.YourTeam.JoinRequestAccepted.close',
    defaultMessage: 'Close',
  },
});

export function JoinRequestAccepted({
  route,
  navigation,
}: NativeRootNavigationProps<'JoinRequestAccepted'>) {
  const {formatMessage: t} = useIntl();
  usePreventBackNavigation();
  const {deviceName, projectName} = route.params;

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
        icon={<SuccessCheck width={ICON_SIZE} height={ICON_SIZE} />}
        title={t(m.accepted)}
        titleVariant="header1"
        description={
          <FormattedMessage
            {...m.joinedProject}
            values={{
              deviceName,
              projectName,
              bold: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        }
      />
    </ScreenContentWithDock>
  );
}
