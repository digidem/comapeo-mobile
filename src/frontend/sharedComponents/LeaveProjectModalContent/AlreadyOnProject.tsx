import * as React from 'react';

import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {useProjectSettings} from '../../hooks/server/projects';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  leaveProj: {
    id: 'screens.LeaveProject.AlreadyOnProject.leaveProj',
    defaultMessage: 'Leave Current Project',
  },
  goBack: {
    id: 'screens.goBackect.AlreadyOnProject.goBack',
    defaultMessage: 'Go Back',
  },
  alreadyOnProject: {
    id: 'screens.goBackect.AlreadyOnProject.alreadyOnProject',
    defaultMessage: 'You are already on a project',
  },
  onProject: {
    id: 'screens.goBackect.AlreadyOnProject.onProject',
    defaultMessage: 'You are on {projectName}',
  },
  leaveWarning: {
    id: 'screens.goBackect.AlreadyOnProject.leaveWarning',
    defaultMessage: 'To join a new project you must leave your current one.',
  },
});

type AlreadyOnProjectProps = {
  closeSheet: () => void;
  moveToLeaveProjectModalContent: () => void;
};

export const AlreadyOnProject = ({
  closeSheet,
  moveToLeaveProjectModalContent,
}: AlreadyOnProjectProps) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();

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
          onPress: closeSheet,
        },
      ]}
      icon={<ErrorIcon />}
      title={formatMessage(m.alreadyOnProject)}
      description={
        data?.name
          ? formatMessage(m.onProject, {projectName: data.name})
          : undefined
      }
    />
  );
};
