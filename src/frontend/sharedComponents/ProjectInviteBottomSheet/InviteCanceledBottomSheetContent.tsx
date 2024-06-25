import * as React from 'react';
import {BottomSheetModalContent} from '../BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import Error from '../../images/Error.svg';

const m = defineMessages({
  close: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteCancelled.close',
    defaultMessage: 'Close',
  },
  canceled: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteCancelled.canceled',
    defaultMessage: 'Invite Canceled',
  },
  projectInviteCanceled: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteCancelled.projectInviteCanceled',
    defaultMessage: 'Your invitation to {projectName} has been canceled.',
  },
});

type InviteCanceledBottomSheetContentProps = {
  handleClose: () => void;
  projectName?: string;
};

export const InviteCanceledBottomSheetContent = ({
  handleClose,
  projectName,
}: InviteCanceledBottomSheetContentProps) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetModalContent
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: handleClose,
          text: formatMessage(m.close),
        },
      ]}
      title={formatMessage(m.canceled)}
      description={
        projectName
          ? formatMessage(m.projectInviteCanceled, {
              projectName,
            })
          : undefined
      }
      icon={<Error />}
    />
  );
};
