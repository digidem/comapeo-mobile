import * as React from 'react';
import {BottomSheetContent} from '../BottomSheetModal';
import {defineMessages, useIntl} from 'react-intl';
import GreenCheck from '../images/GreenCheck.svg';

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
    defaultMessage: 'Your invitation to {projName} has been canceled.',
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
    <BottomSheetContent
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
              projName: projectName,
            })
          : undefined
      }
      icon={<GreenCheck />}
    />
  );
};
