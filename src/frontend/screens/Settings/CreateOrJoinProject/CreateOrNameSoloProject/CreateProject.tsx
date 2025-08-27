import * as React from 'react';
import {useForm} from 'react-hook-form';
import {defineMessages, useIntl} from 'react-intl';
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useCreateProject} from '@comapeo/core-react';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {PrimaryButton} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import * as Sentry from '@sentry/react-native';
import {type NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import UniqueProjectIcon from '../../../../images/IndexPointingUp.svg';
import NameMismatchIcon from '../../../../images/WarningYellow.svg';
import SpeechBubbleIcon from '../../../../images/SpeechBubble.svg';
import {InfoRow} from './InfoRow';
import {createStyles} from './sharedCreateNameStyles';
import {useActiveProjectIdActions} from '../../../../contexts/ActiveProjectIdStoreContext';

const m = defineMessages({
  navTitle: {
    id: 'screens.CreateProject.navTitle',
    defaultMessage: 'Start New Project',
  },
  enterName: {
    id: 'screens.CreateProject.enterName',
    defaultMessage: 'Project Name',
  },
  createProjectButton: {
    id: 'screens.CreateProject.createProjectButton',
    defaultMessage: 'Create',
  },
  keepInMind: {
    id: 'screens.CreateProject.keepInMind',
    defaultMessage: 'Keep in mind',
  },
  projectUnique: {
    id: 'screens.CreateProject.projectUnique',
    defaultMessage:
      'Each project is unique and cannot exchange with another project.',
  },
  existingProjectName: {
    id: 'screens.CreateProject.existingProjectName',
    defaultMessage:
      'Using an existing project name does not make them the same project.',
  },
  requestInvites: {
    id: 'screens.CreateProject.requestInvites',
    defaultMessage: 'Request invites to join existing projects.',
  },
});

type FormValues = {projectName: string};

export const CreateProjectScreen = ({
  navigation,
  route,
}: NativeRootNavigationProps<'CreateProject' | 'OnboardingCreateProject'>) => {
  const {formatMessage: t} = useIntl();
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {projectName: ''},
  });
  const createProject = useCreateProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const isOnboarding = route.name === 'OnboardingCreateProject';

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (createProject.status !== 'pending') return;
      if (
        event.data.action.type === 'GO_BACK' ||
        event.data.action.type === 'POP'
      )
        event.preventDefault();
    });
    return unsubscribe;
  }, [navigation, createProject.status]);

  const onSubmit = (values: FormValues) => {
    const name = values.projectName.trim();
    if (!name) return;
    createProject.mutate(
      {name},
      {
        onSuccess: newProjectId => {
          if (isOnboarding) {
            navigation.replace('ProjectCreatedOnboarding', {
              projectId: newProjectId,
              name,
            });
          } else {
            setActiveProjectId(newProjectId);
            navigation.replace('ProjectCreatedNewProject', {name});
          }
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={createStyles.container}>
          <View>
            <HeaderText variant="header5" style={{marginHorizontal: 20}}>
              {t(m.enterName)}
            </HeaderText>

            <View style={{marginHorizontal: 20, marginTop: 10}}>
              <HookFormTextInput
                testID="PROJECT.name-inp"
                control={control}
                name="projectName"
                rules={{maxLength: 100, required: true, minLength: 1}}
                showCharacterCount
              />
            </View>

            <View style={createStyles.divider} />

            <View style={createStyles.infoBox}>
              <HeaderText variant="header6" style={createStyles.infoHeading}>
                {t(m.keepInMind)}
              </HeaderText>
              <InfoRow Icon={UniqueProjectIcon} text={t(m.projectUnique)} />
              <InfoRow
                Icon={NameMismatchIcon}
                text={t(m.existingProjectName)}
              />
              <InfoRow Icon={SpeechBubbleIcon} text={t(m.requestInvites)} />
            </View>
          </View>

          <View style={{paddingHorizontal: 20, alignItems: 'center'}}>
            {createProject.status === 'pending' ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <PrimaryButton
                testID="PROJECT.create-btn"
                fullSize
                text={t(m.createProjectButton)}
                onPress={handleSubmit(onSubmit)}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

CreateProjectScreen.navTitle = m.navTitle;
