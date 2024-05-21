import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';

import {useImportProjectConfig} from '../../../hooks/server/projects';
import {convertFileUriToPosixPath} from '../../../lib/file-system';
import {WHITE} from '../../../lib/styles';
import {Button} from '../../../sharedComponents/Button';
import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {Text} from '../../../sharedComponents/Text';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const m = defineMessages({
  screenTitle: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.screenTitle',
    defaultMessage: 'Project Configuration',
    description: 'Title of project configuration screen',
  },
  importConfigButtonText: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.importConfigButtonText',
    defaultMessage: 'Import Config',
    description: 'Button to import Mapeo config file',
  },
  alertOkButton: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.alertOkButton',
    defaultMessage: 'OK',
    description:
      'Button to dismiss alert after attempting to import a config file',
  },
  configErrorTitle: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.configErrorTitle',
    defaultMessage: 'Import Error',
    description:
      'Title of error dialog when there is an error importing a config file',
  },
  configImportErrorMessage: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.configImportErrorMessage',
    defaultMessage: 'There was an error trying to import this config file',
    description:
      'Description of error dialog when there is an error importing a config file',
  },
  configImportAlertSuccessMessage: {
    id: 'screens.Settings.ProjectSettings.ProjectConfiguration.configImportAlertSuccessMessage',
    defaultMessage: 'Successfully imported config',
    description: 'Message for alert after successful config import',
  },
});

export const ProjectConfigurationScreen = ({
  navigation,
}: NativeRootNavigationProps<'ProjectConfiguration'>) => {
  const {formatMessage: t} = useIntl();

  const importProjectConfigMutation = useImportProjectConfig();

  // Prevent navigating away from screen when import is in progress
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (importProjectConfigMutation.isPending) {
        event.preventDefault();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, importProjectConfigMutation.isPending]);

  async function importConfigFile() {
    let result;
    try {
      result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
      });
    } catch (_err) {
      Alert.alert(t(m.configErrorTitle), t(m.configImportErrorMessage), [
        {text: t(m.alertOkButton)},
      ]);
      return;
    }

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    // Shouldn't happen based on how the library works
    if (!asset) return;

    importProjectConfigMutation.mutate(convertFileUriToPosixPath(asset.uri), {
      onSuccess: async () => {
        await FileSystem.deleteAsync(asset.uri).catch((err: unknown) => {
          // TODO: might be okay for this to just be a no-op?
          console.log(err);
        });

        Alert.alert('', t(m.configImportAlertSuccessMessage));
      },
      onError: () => {
        Alert.alert(t(m.configErrorTitle), t(m.configImportErrorMessage), [
          {text: t(m.alertOkButton)},
        ]);
      },
    });
  }

  return (
    <>
      <ScreenContentWithDock
        dockContent={
          <Button
            fullWidth
            onPress={importConfigFile}
            disabled={importProjectConfigMutation.isPending}>
            <Text style={styles.importButtonText}>
              {t(m.importConfigButtonText)}
            </Text>
          </Button>
        }
      />
      {importProjectConfigMutation.isPending && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
};

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {headerTitle: intl(m.screenTitle)};
  };
}

const styles = StyleSheet.create({
  root: {flex: 1},
  scrollContentContainer: {padding: 20},
  importButtonText: {
    fontSize: 16,
    color: WHITE,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    width: '100%',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
