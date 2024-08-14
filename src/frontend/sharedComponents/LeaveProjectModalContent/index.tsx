import * as React from 'react';
import {useAcceptInvite} from '../../hooks/server/invites';
import {AlreadyOnProject} from './AlreadyOnProject';
import {LeaveProject} from './LeaveProject';
import {useProjectSettings} from '../../hooks/server/projects';
import {LeaveProjectModalState} from '../ProjectInviteBottomSheet';

type LeaveProjectModalContentProps = {
  closeSheet: () => void;
  inviteId: string;
  accept: ReturnType<typeof useAcceptInvite>;
  leaveModalState: LeaveProjectModalState;
  setToLeaveProject: () => void;
};

export const LeaveProjectModalContent = ({
  closeSheet,
  inviteId,
  accept,
  leaveModalState,
  setToLeaveProject,
}: LeaveProjectModalContentProps) => {
  const {data} = useProjectSettings();

  return leaveModalState === 'AlreadyOnProj' ? (
    <AlreadyOnProject
      moveToLeaveProjectModalContent={setToLeaveProject}
      closeSheet={closeSheet}
      projectName={data?.name}
    />
  ) : (
    <LeaveProject
      closeSheet={closeSheet}
      inviteId={inviteId}
      accept={accept}
      projectName={data?.name}
    />
  );
};
