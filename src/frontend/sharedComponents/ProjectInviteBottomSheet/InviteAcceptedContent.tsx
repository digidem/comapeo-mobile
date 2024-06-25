import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import GreenCheck from '../../images/GreenCheck.svg';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  goToMap: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteAcceptedContent.goToMap',
    defaultMessage: 'Go To Map',
  },
  goToSync: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteAcceptedContent.goToSync',
    defaultMessage: 'Go To Sync',
  },
  success: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteAcceptedContent.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteAcceptedContent.youHaveJoined',
    defaultMessage: 'You have joined {projectName}',
  },
});

export function InviteAcceptedContent({
  projectName,
  onGoToMap,
  onGoToSync,
}: {
  projectName: string;
  onGoToMap: () => void;
  onGoToSync: () => void;
}) {
  const {formatMessage: t} = useIntl();
  return (
    <BottomSheetModalContent
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: onGoToMap,
          text: t(m.goToMap),
        },
        {
          onPress: onGoToSync,
          text: t(m.goToSync),
          variation: 'filled',
        },
      ]}
      title={t(m.success)}
      description={t(m.youHaveJoined, {projectName})}
      icon={<GreenCheck />}
    />
  );
}
