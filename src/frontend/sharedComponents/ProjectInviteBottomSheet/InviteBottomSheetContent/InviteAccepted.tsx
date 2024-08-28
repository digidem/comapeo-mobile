import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';

import GreenCheck from '../../../images/GreenCheck.svg';
import {BottomSheetModalContent} from '../../BottomSheetModal';

const m = defineMessages({
  goToMap: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteAccepted.goToMap',
    defaultMessage: 'Go To Map',
  },
  goToSync: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteAccepted.goToSync',
    defaultMessage: 'Go To Sync',
  },
  success: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteAccepted.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.InviteAccepted.youHaveJoined',
    defaultMessage: 'You have joined <bold>{projectName}</bold>',
  },
});

export function InviteAccepted({
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
