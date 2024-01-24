import * as React from 'react';
import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';
import {InviteWithTimeStamp} from '../hooks/useProjectInviteListener';
import InviteIcon from '../images/JoinProjectIcon.svg';
import {useApi} from '../contexts/ApiContext';

type ProjectInviteBottomSheetProps = Omit<
  ReturnType<typeof useBottomSheetModal>,
  'openSheet'
> & {
  clearInvite: (inviteId: string) => void;
  invites: InviteWithTimeStamp[];
  clearAllInvites: () => void;
};

export const ProjectInviteBottomSheet = ({
  sheetRef,
  isOpen,
  clearInvite,
  invites,
  closeSheet,
  clearAllInvites,
}: ProjectInviteBottomSheetProps) => {
  const oldestInvite =
    !invites || invites.length < 1
      ? undefined
      : invites.reduce((oldest, current) => {
          return current.time < oldest.time ? current : oldest;
        }, invites[0]);

  const mapeoApi = useApi();

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      <BottomSheetContent
        buttonConfigs={[
          {
            variation: 'outlined',
            onPress: () => {
              // Shouldn't get here, but appeases typescript
              if (!oldestInvite) {
                closeSheet();
                return;
              }
              mapeoApi.invite.reject(oldestInvite.projectId);
              clearInvite(oldestInvite.projectId);
              if (invites.length <= 1) closeSheet();
            },
            text: 'Decline Invite',
          },
          {
            variation: 'filled',
            onPress: () => {
              // Shouldn't get here, but appeases typescript
              if (!oldestInvite) {
                closeSheet();
                return;
              }
              // If user accepts an invite, we assume that all other invites can be cleared
              mapeoApi.invite.accept(oldestInvite.projectId);
              clearAllInvites();
              closeSheet();
            },
            text: 'Accept Invite',
          },
        ]}
        title={`Join Project ${oldestInvite?.projectName || ''}`}
        description={"You've been invited to join"}
        icon={<InviteIcon width={60} height={60} />}
      />
    </BottomSheetModal>
  );
};
