import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useForm} from 'react-hook-form';
import {HeaderText} from '../Text/HeaderText';
import {PrimaryButton} from '../Buttons';
import {HookFormTextInput} from '../HookFormTextInput';
import {BodyText} from '../Text/BodyText';
import {SvgProps} from 'react-native-svg';
import {BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';
import UniqueProjectIcon from '../../images/IndexPointingUp.svg';
import NameMismatchIcon from '../../images/WarningYellow.svg';
import SpeechBubbleIcon from '../../images/SpeechBubble.svg';

const m = defineMessages({
  title: {
    id: 'screens.CreateProjectForm.title',
    defaultMessage: 'Start New Project',
  },
  titleSoloProject: {
    id: 'screens.CreateProjectForm.titleSoloProject',
    defaultMessage: 'Name My Project',
  },
  enterName: {
    id: 'screens.CreateProjectForm.enterName',
    defaultMessage: 'Project Name',
  },
  createProjectButton: {
    id: 'screens.CreateProjectForm.createProjectButton',
    defaultMessage: 'Create',
  },
  saveProjectButton: {
    id: 'screens.CreateProjectForm.saveProjectButton',
    defaultMessage: 'Save',
  },
  keepInMind: {
    id: 'screens.CreateProjectForm.keepInMind',
    defaultMessage: 'Keep in mind',
  },
  projectUnique: {
    id: 'screens.CreateProjectForm.projectUnique',
    defaultMessage:
      'Each project is unique and cannot exchange with another project.',
  },
  existingProjectName: {
    id: 'screens.CreateProjectForm.existingProjectName',
    defaultMessage:
      'Using an existing project name does not make them the same project.',
  },
  requestInvites: {
    id: 'screens.CreateProjectForm.requestInvites',
    defaultMessage: 'Request invites to join existing projects.',
  },
});

export type CreateProjectFormProps = {
  submitLabel: string;
  isPending: boolean;
  onSubmit: (projectName: string) => void;
};

export const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  submitLabel,
  isPending,
  onSubmit,
}) => {
  const {formatMessage: t} = useIntl();
  const {control, handleSubmit} = useForm<{projectName: string}>({
    defaultValues: {projectName: ''},
  });

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
            {isPending ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <PrimaryButton
                testID="PROJECT.submit-btn"
                fullSize
                text={submitLabel}
                onPress={handleSubmit(({projectName}) =>
                  onSubmit(projectName.trim()),
                )}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
