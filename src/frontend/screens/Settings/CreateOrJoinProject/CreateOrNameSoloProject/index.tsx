import * as React from 'react';
import {CreateProjectForm} from '../../../../sharedComponents/Projects/CreateProjectForm';
import {defineMessages, MessageDescriptor, useIntl} from 'react-intl';
import {useCreateProject, useUpdateProjectSettings} from '@comapeo/core-react';
import {NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import {useActiveProjectIdActions} from '../../../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {useActiveProject} from '../../../../contexts/ActiveProjectContext';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.title',
    defaultMessage: 'Start New Project',
  },
  titleSoloProject: {
    id: 'screens.Settings.CreateOrJoinProject.titleSoloProject',
    defaultMessage: 'Name My Project',
  },
  createProjectButton: {
    id: 'screens.Settings.CreateOrJoinProject.createProjectButton',
    defaultMessage: 'Create',
  },
  saveProjectButton: {
    id: 'screens.Settings.CreateOrJoinProject.saveProjectButton',
    defaultMessage: 'Save',
  },
});

export const CreateOrNameSoloProject = ({
  navigation,
  route,
}: NativeRootNavigationProps<'CreateProject' | 'NameSoloProject'>) => {
  const isSolo = route.name === 'NameSoloProject';
  const {formatMessage: t} = useIntl();

  const {setActiveProjectId} = useActiveProjectIdActions();
  const createProjectMutation = useCreateProject();
  const {projectId} = useActiveProject();
  const updateSettingsMutation = useUpdateProjectSettings({
    projectId: projectId,
  });

  const mutationIsPending =
    createProjectMutation.status === 'pending' ||
    updateSettingsMutation.status === 'pending';

  React.useEffect(() => {
    // Prevent back navigation while project creation mutation is pending
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!mutationIsPending) return;
      if (
        event.data.action.type === 'GO_BACK' ||
        event.data.action.type === 'POP'
      ) {
        event.preventDefault();
      }
    });
    return () => unsubscribe();
  }, [navigation, mutationIsPending]);

  const handleCreateOrUpdateProject = (projectName: string) => {
    const name = projectName.trim();
    const onError = (err: unknown) => {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
    };

    if (isSolo) {
      updateSettingsMutation.mutate(
        {name},
        {
          onSuccess: () => navigation.replace('ProjectCreatedNewSolo', {name}),
          onError,
        },
      );
    } else {
      createProjectMutation.mutate(
        {name},
        {
          onSuccess: id => {
            setActiveProjectId(id);
            navigation.replace('ProjectCreatedNewProject', {name});
          },
          onError,
        },
      );
    }
  };

  return (
    <CreateProjectForm
      submitLabel={isSolo ? t(m.saveProjectButton) : t(m.createProjectButton)}
      isPending={mutationIsPending}
      onSubmit={handleCreateOrUpdateProject}
    />
  );
};

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return ({
    route,
  }:
    | NativeRootNavigationProps<'CreateProject'>
    | NativeRootNavigationProps<'NameSoloProject'>): NativeStackNavigationOptions => {
    const isSolo = route.name === 'NameSoloProject';
    return {
      headerTitle: isSolo ? intl(m.titleSoloProject) : intl(m.title),
    };
  };
}
