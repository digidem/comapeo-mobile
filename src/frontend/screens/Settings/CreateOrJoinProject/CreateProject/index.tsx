import * as React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {useForm} from 'react-hook-form';
import {defineMessages, useIntl} from 'react-intl';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  useCreateProject,
  useImportProjectConfig,
  useUpdateProjectSettings,
} from '@comapeo/core-react';
import {useSelectFile} from '../../../../hooks/files';
import {convertFileUriToPosixPath} from '../../../../lib/file-system';
import {BLACK, LIGHT_GREY} from '../../../../lib/styles';
import noop from '../../../../lib/noop';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {
  PrimaryButton,
  SecondaryButton,
} from '../../../../sharedComponents/Buttons';
import {HeaderText} from '../../../../sharedComponents/Text/HeaderText';
import {useActiveProjectIdActions} from '../../../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {useActiveProject} from '../../../../contexts/ActiveProjectContext';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.CreateProject.title',
    defaultMessage: 'New Project',
  },
  enterName: {
    id: 'screens.Settings.CreateOrJoinProject.enterName',
    defaultMessage: 'Enter a name for the Project',
  },
  createProjectButton: {
    id: 'screens.Settings.CreateOrJoinProject.createProjectButton',
    defaultMessage: 'Create Project',
  },
  advancedSettings: {
    id: 'screens.Settings.CreateOrJoinProject.advancedSettings',
    defaultMessage: 'Advanced Project Settings',
  },
  importCategories: {
    id: 'screens.Settings.CreateOrJoinProject.importCategories',
    defaultMessage: 'Import Categories',
  },
  importConfigFileError: {
    id: 'screens.Settings.CreateOrJoinProject.importConfigFileError',
    defaultMessage: 'File name should end with .comapeocat',
  },
  categoryImportTitle: {
    id: 'screens.Settings.CreateOrJoinProject.importSuccessTitle',
    defaultMessage: 'Successfully imported categories:',
  },
  okButton: {
    id: 'screens.Settings.CreateOrJoinProject.okButton',
    defaultMessage: 'OK',
  },
});

type ConfigFileImportResult = {
  type: 'success';
  file: DocumentPicker.DocumentPickerAsset;
};

type ProjectFormType = {
  projectName: string;
};

export const CreateProject: NativeNavigationComponent<'CreateProject'> = ({
  navigation,
  route,
}) => {
  const {formatMessage: t} = useIntl();
  const [advancedSettingOpen, setAdvancedSettingOpen] = React.useState(false);
  const [configFileResult, setConfigFileResult] =
    React.useState<ConfigFileImportResult | null>(null);

  const action = route.params.action;

  const {setActiveProjectId} = useActiveProjectIdActions();
  const selectFileMutation = useSelectFile();
  const createProjectMutation = useCreateProject();
  const {projectId} = useActiveProject();
  const updateSettingsMutation = useUpdateProjectSettings({
    projectId: projectId,
  });
  const importProjectConfig = useImportProjectConfig({projectId});

  const mutationIsPending =
    selectFileMutation.status === 'pending' ||
    createProjectMutation.status === 'pending' ||
    importProjectConfig.status === 'pending' ||
    updateSettingsMutation.status === 'pending';

  React.useEffect(() => {
    // Prevent back navigation while project creation mutation is pending
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!mutationIsPending) {
        return;
      }

      event.preventDefault();
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
    const fileUri =
      configFileResult?.type === 'success'
        ? configFileResult.file.uri
        : undefined;
    const configPath = fileUri && convertFileUriToPosixPath(fileUri);

    const onProjectCreated = () =>
      navigation.navigate('ProjectCreated', {name: projectName});

    const onError = (err: unknown) => {
      Sentry.captureException(err);
      navigation.navigate('ErrorBottomSheet');
    };

    if (action === 'UpdateSoloProject') {
      const updateSettings = () =>
        updateSettingsMutation.mutate(
          {name: projectName},
          {
            onSuccess: () => {
              if (fileUri) {
                FileSystem.deleteAsync(fileUri, {idempotent: true}).catch(noop);
              }
              onProjectCreated();
            },
            onError,
          },
        );

      if (configPath) {
        importProjectConfig.mutate(
          {configPath},
          {
            onSuccess: updateSettings,
            onError,
          },
        );
      } else {
        updateSettings();
      }
    } else {
      createProjectMutation.mutate(
        {name: projectName, configPath},
        {
          onSuccess: projectId => {
            setActiveProjectId(projectId);
            onProjectCreated();
          },
          onError,
        },
      );
    }
  };

  function selectConfigFile() {
    selectFileMutation.mutate(
      {
        copyToCacheDirectory: true,
        allowedExtensions: ['comapeocat', 'zip'],
      },
      {
        onSuccess: selected => {
          if (!selected) return;
          setConfigFileResult({type: 'success', file: selected});
          Alert.alert(t(m.categoryImportTitle), selected.name, [
            {text: t(m.okButton)},
          ]);
        },
        onError: err => {
          navigation.navigate('ErrorBottomSheet');
          Sentry.captureException(err);
        },
      },
    );
  }

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
            <View
              style={{marginTop: 20}}
              testID="PROJECT.advanced-settings-toggle">
              <TouchableOpacity
                onPress={() => setAdvancedSettingOpen(prev => !prev)}
                style={styles.accordianHeader}>
                <HeaderText variant="header5">
                  {t(m.advancedSettings)}
                </HeaderText>
                <MaterialIcon
                  color={BLACK}
                  name={
                    !advancedSettingOpen
                      ? 'keyboard-arrow-up'
                      : 'keyboard-arrow-down'
                  }
                  size={40}
                />
              </TouchableOpacity>
              {advancedSettingOpen && (
                <View style={styles.importConfigContainer}>
                  <SecondaryButton
                    fullSize={true}
                    style={{alignSelf: 'center'}}
                    onPress={() => {
                      selectConfigFile();
                    }}
                    text={t(m.importCategories)}
                  />

                  {configFileResult?.type === 'success' && (
                    <HeaderText variant="header5" style={styles.configFileName}>
                      {configFileResult.file.name}
                    </HeaderText>
                  )}
                </View>
              )}
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            {mutationIsPending ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <PrimaryButton
                testID="PROJECT.create-btn"
                fullSize={true}
                text={t(m.createProjectButton)}
                onPress={handleSubmit(handleCreateOrUpdateProject)}
              />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

CreateProject.navTitle = m.title;

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 20,
    height: '100%',
    justifyContent: 'space-between',
  },
  accordianHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY,
  },
  importConfigContainer: {
    padding: 20,
    gap: 20,
  },
  configFileName: {
    textAlign: 'center',
  },
});
