import * as React from 'react';
import {useForm} from 'react-hook-form';
import {defineMessages, MessageDescriptor, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useCreateProject, useUpdateProjectSettings} from '@comapeo/core-react';
import {HookFormTextInput} from '../../../sharedComponents/HookFormTextInput';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {PrimaryButton} from '../../../sharedComponents/Buttons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {useActiveProjectIdActions} from '../../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {useActiveProject} from '../../../contexts/ActiveProjectContext';
import {toError} from '../../../utils/errors';
import UniqueProjectIcon from '../../../images/IndexPointingUp.svg';
import NameMismatchIcon from '../../../images/WarningYellow.svg';
import SpeechBubbleIcon from '../../../images/SpeechBubble.svg';
import {BLUE_GREY, NEW_DARK_GREY} from '../../../lib/styles';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {SvgProps} from 'react-native-svg';
import {ScreenContentWithButtonDock} from '../../../sharedComponents/ScreenContentWithDock/ScreenContentWithButtonDock';

const m = defineMessages({
  title: {
    id: '$1screens.Settings.CreateOrJoinProject.CreateProject.title',
    defaultMessage: 'Start New Project',
  },
  titleSoloProject: {
    id: '$1screens.Settings.CreateOrJoinProject.CreateProject.titleSoloProject',
    defaultMessage: 'Name My Project',
  },
  enterName: {
    id: '$1screens.Settings.CreateOrJoinProject.enterName',
    defaultMessage: 'Project Name',
  },
  createProjectButton: {
    id: '$1screens.Settings.CreateOrJoinProject.createProjectButton',
    defaultMessage: 'Create',
  },
  saveProjectButton: {
    id: '$1screens.Settings.CreateOrJoinProject.saveProjectButton',
    defaultMessage: 'Save',
  },
  keepInMind: {
    id: 'screens.Settings.CreateOrJoinProject.keepInMind',
    defaultMessage: 'Keep in mind',
  },
  projectUnique: {
    id: 'screens.Settings.CreateOrJoinProject.projectUnique',
    defaultMessage:
      'Each project is unique and cannot exchange with another project.',
  },
  existingProjectName: {
    id: 'screens.Settings.CreateOrJoinProject.existingProjectName',
    defaultMessage:
      'Using an existing project name does not make them the same project.',
  },
  requestInvites: {
    id: 'screens.Settings.CreateOrJoinProject.requestInvites',
    defaultMessage: 'Request invites to join existing projects.',
  },
});

type ProjectFormType = {
  projectName: string;
};

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
      if (!mutationIsPending) {
        return;
      }

      if (
        event.data.action.type === 'GO_BACK' ||
        event.data.action.type === 'POP'
      ) {
        event.preventDefault();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, mutationIsPending]);

  const {control, handleSubmit} = useForm<ProjectFormType>({
    defaultValues: {projectName: ''},
  });

  const handleCreateOrUpdateProject = (val: ProjectFormType) => {
    const projectName = val.projectName.trim();

    const onError = (err: unknown) => {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet', {
        error: toError(err, 'Error creating or naming project'),
      });
    };

    if (isSolo) {
      updateSettingsMutation.mutate(
        {name: projectName},
        {
          onSuccess: () => {
            createProjectMutation.mutate(undefined, {
              onError: err => {
                Sentry.captureException(err);
              },
            });

            navigation.replace('ShareProjectStats', {
              projectName,
            });
          },
          onError,
        },
      );
    } else {
      createProjectMutation.mutate(
        {name: projectName},
        {
          onSuccess: projectId => {
            setActiveProjectId(projectId);
            navigation.replace('ShareProjectStats', {
              projectName,
            });
          },
          onError,
        },
      );
    }
  };

  return (
    <ScreenContentWithButtonDock
      loading={mutationIsPending}
      contentContainerStyle={{gap: 20}}
      bottomButton={
        <PrimaryButton
          testID="PROJECT.create-btn"
          fullSize={true}
          text={isSolo ? t(m.saveProjectButton) : t(m.createProjectButton)}
          onPress={handleSubmit(handleCreateOrUpdateProject)}
        />
      }>
      <HeaderText style={{alignSelf: 'flex-start'}} variant="header5">
        {t(m.enterName)}
      </HeaderText>
      <View style={{alignSelf: 'stretch'}}>
        <HookFormTextInput
          testID="PROJECT.name-inp"
          control={control}
          name="projectName"
          rules={{maxLength: 60, required: true, minLength: 1}}
          showCharacterCount
        />
      </View>
      <View style={styles.divider} />
      <View style={styles.infoBox}>
        <HeaderText variant="header6" style={styles.infoHeading}>
          {t(m.keepInMind)}
        </HeaderText>

        <InfoRow Icon={UniqueProjectIcon} text={t(m.projectUnique)} />
        <InfoRow Icon={NameMismatchIcon} text={t(m.existingProjectName)} />
        <InfoRow Icon={SpeechBubbleIcon} text={t(m.requestInvites)} />
      </View>
    </ScreenContentWithButtonDock>
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

type InfoRowProps = {
  Icon: React.FC<SvgProps>;
  text: string;
};

function InfoRow({Icon, text}: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Icon width={20} height={26} style={styles.infoIcon} />
      <BodyText variant="smallMeta" style={styles.infoText}>
        {text}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: BLUE_GREY,
  },
  infoBox: {
    alignSelf: 'stretch',
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    gap: 12,
  },
  infoHeading: {
    marginBottom: 4,
    paddingLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    color: NEW_DARK_GREY,
  },
});
