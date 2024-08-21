import * as React from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {useForm} from 'react-hook-form';
import {defineMessages, useIntl} from 'react-intl';
import {Keyboard, KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {UIActivityIndicator} from 'react-native-indicators';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {usePersistedProjectId} from '../../../../hooks/persistedState/usePersistedProjectId';
import {useCreateProject} from '../../../../hooks/server/projects';
import {convertFileUriToPosixPath} from '../../../../lib/file-system';
import {BLACK, LIGHT_GREY} from '../../../../lib/styles';
import noop from '../../../../lib/noop';
import {Button} from '../../../../sharedComponents/Button';
import {ErrorBottomSheet} from '../../../../sharedComponents/ErrorBottomSheet';
import {HookFormTextInput} from '../../../../sharedComponents/HookFormTextInput';
import {Text} from '../../../../sharedComponents/Text';
import {NativeNavigationComponent} from '../../../../sharedTypes/navigation';
import {selectFile} from '../../../../lib/selectFile';

const m = defineMessages({
  title: {
    id: 'screens.Settings.CreateOrJoinProject.CreateProject.title',
    defaultMessage: 'Create a Project',
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
    id: 'screens.Settings.CreateOrJoinProject.importConfig',
    defaultMessage: 'Import Config',
  },
  importConfigFileError: {
    id: 'screens.Settings.CreateOrJoinProject.importConfigFileError',
    defaultMessage: 'File name should end with .mapeoconfig',
  },
});

type ConfigFileImportResult =
  | {
      type: 'success';
      file: DocumentPicker.DocumentPickerAsset;
    }
  | {type: 'error'; error: Error};

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

  const updateActiveProjectId = usePersistedProjectId(
    state => state.setProjectId,
  );
  const {
    mutate,
    isPending,
    reset,
    error: projectCreationError,
  } = useCreateProject();

  React.useEffect(() => {
    // Prevent back navigation while project creation mutation is pending
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!isPending) {
        return;
      }

      event.preventDefault();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, isPending]);

  const {control, handleSubmit} = useForm<ProjectFormType>({
    defaultValues: {projectName: ''},
  });

  function handleCreateProject(val: ProjectFormType) {
    mutate(
      {
        name: val.projectName,
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
            FileSystem.deleteAsync(configFileResult.file.uri).catch(noop);
          }

          updateActiveProjectId(projectId);

          navigation.navigate('ProjectCreated', {name: val.projectName});
        },
      },
    );
  }

  async function importConfigFile() {
    try {
      const asset = await selectFile(['mapeoconfig', 'mapeosettings']);
      if (!asset) return;
      setConfigFileResult({type: 'success', file: asset});
    } catch (err) {
      if (err instanceof Error) {
        setConfigFileResult({type: 'error', error: err});
      }

      return;
    }
  }

  const errorSheetProps =
    configFileResult?.type === 'error'
      ? {
          error: configFileResult.error,
          clearError: () => setConfigFileResult(null),
        }
      : projectCreationError
        ? {
            error: projectCreationError,
            clearError: reset,
            tryAgain: handleSubmit(handleCreateProject),
          }
        : {
            error: null,
            clearError: () => {},
          };
  return (
    <React.Fragment>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={styles.container}>
          <View>
            <Text style={{marginHorizontal: 20}}>{t(m.enterName)}</Text>
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
                <Text>{t(m.advancedSettings)}</Text>
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
                  <Button
                    fullWidth
                    variant="outlined"
                    onPress={() => {
                      importConfigFile();
                    }}>
                    {t(m.importConfig)}
                  </Button>

                  {configFileResult?.type === 'success' && (
                    <Text style={styles.configFileName}>
                      {configFileResult.file.name}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
          <View style={{paddingHorizontal: 20}}>
            {isPending ? (
              <UIActivityIndicator size={30} style={{marginBottom: 20}} />
            ) : (
              <Button
                testID="PROJECT.create-btn"
                fullWidth
                onPress={handleSubmit(handleCreateProject)}>
                {t(m.createProjectButton)}
              </Button>
            )}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <ErrorBottomSheet {...errorSheetProps} />
    </React.Fragment>
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
