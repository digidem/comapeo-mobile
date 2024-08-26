import * as React from 'react';

import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  leaveProj: {
    id: 'screens.LeaveProject.AlreadyOnProject.leaveProj',
    defaultMessage: 'Leave Current Project',
  },
  goBack: {
    id: 'screens.LeaveProject.AlreadyOnProject.goBack',
    defaultMessage: 'Go Back',
  },
  alreadyOnProject: {
    id: 'screens.LeaveProject.AlreadyOnProject.alreadyOnProject',
    defaultMessage: 'You are already on a project',
  },
  onProject: {
    id: 'screens.LeaveProject.AlreadyOnProject.onProject',
    defaultMessage: 'You are on {projectName}',
  },
  leaveWarning: {
    id: 'screens.LeaveProject.AlreadyOnProject.leaveWarning',
    defaultMessage: 'To join a new project you must leave your current one.',
  },
});

type AlreadyOnProjectProps = {
  closeSheet: () => void;
  moveToLeaveProjectModalContent: () => void;
  projectName?: string;
};

export const AlreadyOnProject = ({
  closeSheet,
  moveToLeaveProjectModalContent,
  projectName,
}: AlreadyOnProjectProps) => {
  const {formatMessage} = useIntl();

  return (
    <BottomSheetModalContent
      buttonConfigs={[
        {
          variation: 'filled',
          dangerous: true,
          text: formatMessage(m.leaveProj),
          onPress: moveToLeaveProjectModalContent,
        },
        {
          variation: 'outlined',
          text: formatMessage(m.goBack),
          onPress: () => {
            console.log('ALREADY ON PROJECT CLOSE');
            closeSheet();
          },
        },
      ]}
      icon={<ErrorIcon />}
      title={formatMessage(m.alreadyOnProject)}
      description={
        projectName
          ? formatMessage(m.onProject, {projectName: projectName})
          : undefined
      }
    />
  );
};
