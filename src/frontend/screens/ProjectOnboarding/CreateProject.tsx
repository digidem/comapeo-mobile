import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useCreateProject} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';

import {CreateProjectForm} from '../../sharedComponents/Projects/CreateProjectForm';

const m = defineMessages({
  next: {id: 'projectOnboarding.createProject.next', defaultMessage: 'Next'},
  title: {
    id: 'screens.ProjectOnboarding.CreateProject.title',
    defaultMessage: 'Start New Project',
  },
});

export const CreateProject: NativeNavigationComponent<'CreateProject'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const createProjectMutation = useCreateProject();

  const handleSubmit = (projectName: string) => {
    const onError = (err: unknown) => {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
    };

    createProjectMutation.mutate(
      {name: projectName},
      {
        onSuccess: projectId => {
          setActiveProjectId(projectId);
        },
        onError,
      },
    );
  };

  return (
    <CreateProjectForm
      submitLabel={t(m.next)}
      isPending={createProjectMutation.status === 'pending'}
      onSubmit={handleSubmit}
    />
  );
};

CreateProject.navTitle = m.title;
