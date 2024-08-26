import * as React from 'react';
import {AlreadyOnProject} from './AlreadyOnProject';
import {LeaveProject} from './LeaveProject';

export const LeaveProjectModalContent = ({
  onCancel,
  onSuccess,
  inviteId,
  projectName,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  inviteId: string;
  projectName?: string;
}) => {
  const [display, setDisplay] = React.useState<'AlreadyOnProj' | 'Leave'>(
    'AlreadyOnProj',
  );

  return display === 'AlreadyOnProj' ? (
    <AlreadyOnProject
      onProceed={() => {
        setDisplay('Leave');
      }}
      onCancel={onCancel}
      projectName={projectName}
    />
  ) : (
    <LeaveProject
      onCancel={onCancel}
      onSuccess={onSuccess}
      inviteId={inviteId}
      projectName={projectName}
    />
  );
};
