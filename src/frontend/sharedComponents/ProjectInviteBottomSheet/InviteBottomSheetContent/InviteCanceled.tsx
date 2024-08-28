import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import Error from '../../../images/Error.svg';
import {BottomSheetModalContent} from '../../BottomSheetModal';

const m = defineMessages({
  canceled: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteCanceled.canceled',
    defaultMessage: 'Invite Canceled!',
  },
  close: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteCanceled.close',
    defaultMessage: 'Close',
  },
  projectInviteCanceled: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteCanceled.projectInviteCanceled',
    defaultMessage:
      'Your invitation to <bold>{projectName}</bold> has been canceled.',
  },
});

export function InviteCanceled({
  projectName,
  onClose,
}: {
  projectName: string;
  onClose: () => void;
}) {
  const {formatMessage: t} = useIntl();
  return (
    <BottomSheetModalContent
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: onClose,
          text: t(m.close),
        },
      ]}
      title={t(m.canceled)}
      description={t(m.projectInviteCanceled, {projectName})}
      icon={<Error />}
    />
  );
}
