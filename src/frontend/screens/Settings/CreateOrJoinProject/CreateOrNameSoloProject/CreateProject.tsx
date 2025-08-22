import * as React from 'react';
import {useForm} from 'react-hook-form';
import {defineMessages, useIntl} from 'react-intl';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
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
import {BLUE_GREY, NEW_DARK_GREY} from '../../../../lib/styles';
import {BodyText} from '../../../../sharedComponents/Text/BodyText';
import {type SvgProps} from 'react-native-svg';
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
          setActiveProjectId(newProjectId);
          if (!isOnboarding) {
            navigation.replace('ProjectCreatedNewProject', {
              name: name,
            });
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
        <View style={styles.container}>
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

            <View style={styles.divider} />

            <View style={styles.infoBox}>
              <HeaderText variant="header6" style={styles.infoHeading}>
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
                testID="PROJECT.submit-btn"
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

type InfoRowProps = {Icon: React.FC<SvgProps>; text: string};
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
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: BLUE_GREY,
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 10,
    gap: 12,
  },
  infoHeading: {marginBottom: 4, paddingLeft: 4},
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  infoIcon: {marginTop: 2},
  infoText: {flex: 1, color: NEW_DARK_GREY},
});
