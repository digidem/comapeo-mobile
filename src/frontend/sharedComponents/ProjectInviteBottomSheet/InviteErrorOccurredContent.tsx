import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import Error from '../../images/Error.svg';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  errorOccurred: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteErrorOccurredContent.errorOccurred',
    defaultMessage: 'Invite Error Occurred!',
  },
  close: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteErrorOccurredContent.close',
    defaultMessage: 'Close',
  },
  couldNotJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteErrorOccurredContent.couldNotJoin',
    defaultMessage: 'Could not join <bold>{projectName}</bold> due to an error',
  },
});

export function InviteErrorOccurredContent({
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
