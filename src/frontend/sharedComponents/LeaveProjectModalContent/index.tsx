import * as React from 'react';
import {useAcceptInvite} from '../../hooks/server/invites';
import {AlreadyOnProject} from './AlreadyOnProject';
import {LeaveProject} from './LeaveProject';
import {useProjectSettings} from '../../hooks/server/projects';

type LeaveProjectModalContentProps = {
  cancel: () => void;
  inviteId: string;
  accept: ReturnType<typeof useAcceptInvite>;
};

export const LeaveProjectModalContent = ({
  cancel,
  inviteId,
  accept,
}: LeaveProjectModalContentProps) => {
  const [leaveModalState, setLeaveModalState] = React.useState<
    'AlreadyOnProj' | 'LeaveProj'
  >('AlreadyOnProj');
  const {data} = useProjectSettings();

  function closeAndResetLeaveModal() {
    cancel();
    setLeaveModalState('AlreadyOnProj');
  }

  return leaveModalState === 'AlreadyOnProj' ? (
    <AlreadyOnProject
      moveToLeaveProjectModalContent={() => {
        setLeaveModalState('LeaveProj');
      }}
      closeSheet={closeAndResetLeaveModal}
    />
  ) : (
    <LeaveProject
      closeSheet={closeAndResetLeaveModal}
      inviteId={inviteId}
      accept={accept}
      projectName={data?.name}
    />
  );
};
