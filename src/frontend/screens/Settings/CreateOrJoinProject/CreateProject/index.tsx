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
} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
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
import {extractConfigMetadata} from '../../../../lib/configParser';

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
  importConfig: {
    id: 'screens.Settings.CreateOrJoinProject.importCategories',
    defaultMessage: 'Import Categories',
  },
  importConfigFileError: {
    id: 'screens.Settings.CreateOrJoinProject.importConfigFileError',
    defaultMessage: 'File name should end with .comapeocat',
  },
  configImportTitle: {
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
}) => {
  const {formatMessage: t} = useIntl();
  const [advancedSettingOpen, setAdvancedSettingOpen] = React.useState(false);
  const [configFileResult, setConfigFileResult] =
    React.useState<ConfigFileImportResult | null>(null);

  const {setActiveProjectId} = useActiveProjectIdActions();
  const selectFileMutation = useSelectFile();
  const createProjectMutation = useCreateProject();
  const {projectId} = useActiveProject();
  const updateSettingsMutation = useUpdateProjectSettings({
    projectId: projectId,
  });
  const {mutate: importProjectConfig} = useImportProjectConfig({projectId});

  const mutationIsPending =
    selectFileMutation.status === 'pending' ||
    createProjectMutation.status === 'pending';

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

  async function handleCreateProject(val: ProjectFormType) {
    const projectName = val.projectName.trim();

    if (projectId) {
      let configMetadata = undefined;

      if (configFileResult?.type === 'success') {
        try {
          configMetadata = await extractConfigMetadata(
            configFileResult.file.uri,
          );

          await new Promise<void>((resolve, reject) => {
            importProjectConfig(
              {
                configPath: convertFileUriToPosixPath(
                  configFileResult.file.uri,
                ),
              },
              {
                onSuccess: () => resolve(),
                onError: err => reject(err),
              },
            );
          });
          FileSystem.deleteAsync(configFileResult.file.uri, {
            idempotent: true,
          }).catch(noop);
        } catch (e) {
          Sentry.captureException(e);
          navigation.navigate('ErrorBottomSheet');
          return;
        }
      }

      updateSettingsMutation.mutate(
        {
          name: projectName,
          configMetadata,
        },
        {
          onSuccess: () => {
            navigation.navigate('ProjectCreated', {name: projectName});
          },
          onError: err => {
            Sentry.captureException(err);
            navigation.navigate('ErrorBottomSheet');
          },
        },
      );
      return;
    }
    createProjectMutation.mutate(
      {
        name: projectName,
        configPath:
          configFileResult?.type === 'success'
            ? convertFileUriToPosixPath(configFileResult.file.uri)
            : undefined,
      },
      {
        onSuccess: projectId => {
          if (configFileResult?.type === 'success') {
            // No need to block UI on this
            // no-op if something fails here. caches can eventually get cleared by the OS automatically.
            FileSystem.deleteAsync(configFileResult.file.uri, {
              idempotent: true,
            }).catch(noop);
          }

          setActiveProjectId(projectId);

          navigation.navigate('ProjectCreated', {name: projectName});
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }

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
          Alert.alert(t(m.configImportTitle), selected.name, [
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
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        style={styles.container}>
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
              <HeaderText variant="header5">{t(m.advancedSettings)}</HeaderText>
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
                  text={t(m.importConfig)}
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
              onPress={handleSubmit(handleCreateProject)}
            />
          )}
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
