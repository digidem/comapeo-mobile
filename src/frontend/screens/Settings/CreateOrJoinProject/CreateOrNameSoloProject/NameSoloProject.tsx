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
import {useUpdateProjectSettings} from '@comapeo/core-react';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {PrimaryButton} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import * as Sentry from '@sentry/react-native';
import {type NativeRootNavigationProps} from '../../../../sharedTypes/navigation';
import UniqueProjectIcon from '../../../../images/IndexPointingUp.svg';
import NameMismatchIcon from '../../../../images/WarningYellow.svg';
import SpeechBubbleIcon from '../../../../images/SpeechBubble.svg';
import {useActiveProject} from '../../../../contexts/ActiveProjectContext';
import {InfoRow} from './InfoRow';
import {createStyles} from './sharedCreateNameStyles';

const m = defineMessages({
  navTitle: {
    id: 'screens.NameSoloProject.navTitle',
    defaultMessage: 'Name My Project',
  },
  enterName: {
    id: 'screens.NameSoloProject.enterName',
    defaultMessage: 'Project Name',
  },
  saveProjectButton: {
    id: 'screens.NameSoloProject.saveProjectButton',
    defaultMessage: 'Save',
  },
  keepInMind: {
    id: 'screens.NameSoloProject.keepInMind',
    defaultMessage: 'Keep in mind',
  },
  projectUnique: {
    id: 'screens.NameSoloProject.projectUnique',
    defaultMessage:
      'Each project is unique and cannot exchange with another project.',
  },
  existingProjectName: {
    id: 'screens.NameSoloProject.existingProjectName',
    defaultMessage:
      'Using an existing project name does not make them the same project.',
  },
  requestInvites: {
    id: 'screens.NameSoloProject.requestInvites',
    defaultMessage: 'Request invites to join existing projects.',
  },
});

type FormValues = {projectName: string};

export const NameSoloProjectScreen = ({
  navigation,
}: NativeRootNavigationProps<'NameSoloProject'>) => {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const {control, handleSubmit} = useForm<FormValues>({
    defaultValues: {projectName: ''},
  });
  const updateSettings = useUpdateProjectSettings({projectId});

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (updateSettings.status !== 'pending') return;
      if (
        event.data.action.type === 'GO_BACK' ||
        event.data.action.type === 'POP'
      )
        event.preventDefault();
    });
    return unsubscribe;
  }, [navigation, updateSettings.status]);

  const onSubmit = (values: FormValues) => {
    const name = values.projectName.trim();
    if (!name) return;
    updateSettings.mutate(
      {name},
      {
        onSuccess: () => {
          navigation.replace('ProjectCreatedNewSolo', {
            name,
          });
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
            {updateSettings.status === 'pending' ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <PrimaryButton
                testID="PROJECT.submit-btn"
                fullSize
                text={t(m.saveProjectButton)}
                onPress={handleSubmit(onSubmit)}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

NameSoloProjectScreen.navTitle = m.navTitle;
