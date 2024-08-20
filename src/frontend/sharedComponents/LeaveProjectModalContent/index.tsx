import * as React from 'react';
import {AlreadyOnProject} from './AlreadyOnProject';
import {LeaveProject} from './LeaveProject';

export const LeaveProjectModalContent = ({
  onClose,
  inviteId,
  projectName,
}: {
  onClose: () => void;
  inviteId: string;
  projectName?: string;
}) => {
  const [display, setDisplay] = React.useState<'AlreadyOnProj' | 'Leave'>(
    'AlreadyOnProj',
  );

  return display === 'AlreadyOnProj' ? (
    <AlreadyOnProject
      moveToLeaveProjectModalContent={() => {
        setDisplay('Leave');
      }}
      closeSheet={onClose}
      projectName={projectName}
    />
  ) : (
    <LeaveProject
      closeSheet={onClose}
      inviteId={inviteId}
      projectName={projectName}
    />
  );
};
