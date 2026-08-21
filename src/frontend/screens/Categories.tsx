import * as FileSystem from 'expo-file-system/legacy';
import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useImportProjectCategories} from '@comapeo/core-react';
import {Alert, StyleSheet, View} from 'react-native';
import {useSelectFile} from '../hooks/files';
import {useProjectSettings, useGetOwnRole} from '../hooks/server/projects';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {MEDIUM_GREY} from '../lib/styles';
import {LoadingIndicator} from '../sharedComponents/LoadingIndicator';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../sharedTypes';
import {convertFileUriToPosixPath} from '../lib/file-system';
import noop from '../lib/noop';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import * as Sentry from '@sentry/react-native';
import {SecondaryButton} from '../sharedComponents/Buttons';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BodyText} from '../sharedComponents/Text/BodyText';

const m = defineMessages({
  navTitle: {
    id: '$1screens.Settings.Config.navTitle',
    defaultMessage: 'Categories',
  },
  name: {
    id: 'screens.Settings.Config.name',
    defaultMessage: 'Category Set:',
  },
  projectName: {
    id: 'screens.Settings.Config.projectName',
    defaultMessage: 'Project Name:',
  },
  created: {
    id: 'screens.Settings.Config.created',
    defaultMessage: 'Created {date} at {time}',
  },
  importCategories: {
    id: '$1screens.Settings.Config.importCategories',
    defaultMessage: 'Import Categories',
  },
  categoryImportTitle: {
    id: '$1screens.Settings.Config.importSuccessTitle',
    defaultMessage: 'Successfully imported categories:',
  },
  okButton: {
    id: '$1screens.Settings.Config.okButton',
    defaultMessage: 'OK',
  },
});

export const Categories: NativeNavigationComponent<'Categories'> = ({
  navigation,
}) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const {projectId} = useActiveProject();
  const {data: deviceRole} = useGetOwnRole();

  const selectFileMutation = useSelectFile();
  const importProjectConfigMutation = useImportProjectCategories({projectId});

  const isCoordinator =
    deviceRole.roleId === COORDINATOR_ROLE_ID ||
    deviceRole.roleId === CREATOR_ROLE_ID;

  const configImportIsPending =
    selectFileMutation.status === 'pending' ||
    importProjectConfigMutation.status === 'pending';

  React.useEffect(() => {
    // Prevent back navigation while project creation mutation is pending
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!configImportIsPending) {
        return;
      }

      event.preventDefault();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, configImportIsPending]);

  async function selectAndImportConfigFile() {
    if (!isCoordinator) return;

    selectFileMutation.mutate(
      {
        copyToCacheDirectory: true,
        allowedExtensions: ['comapeocat', 'zip'],
      },
      {
        onSuccess: selected => {
          if (!selected) return;
          importProjectConfigMutation.mutate(
            {filePath: convertFileUriToPosixPath(selected.uri)},
            {
              onSettled: () => {
                FileSystem.deleteAsync(selected.uri, {idempotent: true}).catch(
                  noop,
                );
              },
              onError: err => {
                Sentry.captureException(err);
                navigation.navigate('ErrorBottomSheet', {error: err});
              },
              onSuccess: () => {
                Alert.alert(
                  formatMessage(m.categoryImportTitle),
                  selected.name,
                  [{text: formatMessage(m.okButton)}],
                );
              },
            },
          );
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {error: err});
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      {data.name && (
        <>
          <HeaderText variant="header5">
            {formatMessage(m.projectName)}
          </HeaderText>
          <BodyText style={{marginBottom: 20}}>{data.name}</BodyText>
        </>
      )}
      {data.configMetadata && (
        <>
          <HeaderText variant="header5">{formatMessage(m.name)}</HeaderText>
          <BodyText style={{color: MEDIUM_GREY}}>
            {formatMessage(m.created, {
              date: formatDate(data.configMetadata.buildDate),
              time: formatHours(data.configMetadata.buildDate),
            })}
          </BodyText>
          <BodyText>{data.configMetadata.name}</BodyText>
        </>
      )}
      {configImportIsPending ? (
        <LoadingIndicator style={{marginTop: 20, flex: 0}} />
      ) : isCoordinator ? (
        <SecondaryButton
          style={{marginTop: 20, alignSelf: 'center'}}
          fullSize={true}
          onPress={selectAndImportConfigFile}
          text={formatMessage(m.importCategories)}
        />
      ) : null}
    </View>
  );
};

Categories.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    flex: 1,
  },
});

function formatDate(rfc3339Date: string) {
  const date = new Date(rfc3339Date);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatHours(rfc3339Date: string) {
  const date = new Date(rfc3339Date);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes} ${ampm}`;
}
