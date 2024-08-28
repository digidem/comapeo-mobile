import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {BottomSheetModalContent} from '../../BottomSheetModal';
import Error from '../../../images/Error.svg';

const m = defineMessages({
  errorOccurred: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteErrorOccurred.errorOccurred',
    defaultMessage: 'Invite Error Occurred!',
  },
  close: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteErrorOccurred.close',
    defaultMessage: 'Close',
  },
  couldNotJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteErrorOccurred.couldNotJoin',
    defaultMessage: 'Could not join <bold>{projectName}</bold> due to an error',
  },
});

export function InviteErrorOccurred({
  onClose,
  projectName,
}: {
  onClose: () => void;
  projectName: string;
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
      title={t(m.errorOccurred)}
      description={t(m.couldNotJoin, {projectName})}
      icon={<Error />}
    />
  );
}
