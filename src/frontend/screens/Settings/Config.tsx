import * as FileSystem from 'expo-file-system';
import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {useSelectFile} from '../../hooks/files';
import {
  useGetOwnRole,
  useImportProjectConfig,
  useProjectSettings,
} from '../../hooks/server/projects';
import {Loading} from '../../sharedComponents/Loading';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {UIActivityIndicator} from 'react-native-indicators';
import {COORDINATOR_ROLE_ID, CREATOR_ROLE_ID} from '../../sharedTypes';
import {convertFileUriToPosixPath} from '../../lib/file-system';
import noop from '../../lib/noop';
import * as Sentry from '@sentry/react-native';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  navTitle: {
    id: 'screens.Settings.Config.navTitle',
    defaultMessage: 'Configuration',
  },
  name: {
    id: 'screens.Settings.Config.name',
    defaultMessage: 'Config Name:',
  },
  projectName: {
    id: 'screens.Settings.Config.projectName',
    defaultMessage: 'Project Name:',
  },
  created: {
    id: 'screens.Settings.Config.created',
    defaultMessage: 'Created {date} at {time}',
  },
  importConfig: {
    id: 'screens.Settings.Config.importConfig',
    defaultMessage: 'Import Config',
  },
});

export const Config: NativeNavigationComponent<'Config'> = ({navigation}) => {
  const {formatMessage} = useIntl();
  const {data, isPending} = useProjectSettings();
  const deviceRole = useGetOwnRole();

  const selectFileMutation = useSelectFile();
  const importProjectConfigMutation = useImportProjectConfig();

  const isCoordinator =
    deviceRole.data?.roleId === COORDINATOR_ROLE_ID ||
    deviceRole.data?.roleId === CREATOR_ROLE_ID;

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
            convertFileUriToPosixPath(selected.uri),
            {
              onSettled: () => {
                FileSystem.deleteAsync(selected.uri, {idempotent: true}).catch(
                  noop,
                );
              },
              onError: err => {
                Sentry.captureException(err);
                navigation.navigate('ErrorBottomSheet');
              },
            },
          );
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }

  if (!data || isPending) {
    return <Loading />;
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
      {deviceRole.isPending || configImportIsPending ? (
        <UIActivityIndicator style={{marginTop: 20, flex: 0}} />
      ) : isCoordinator ? (
        <Button
          style={{marginTop: 20}}
          fullWidth
          variant="outlined"
          onPress={selectAndImportConfigFile}>
          <HeaderText variant="header5" style={{color: COMAPEO_BLUE}}>
            {formatMessage(m.importConfig)}
          </HeaderText>
        </Button>
      ) : null}
    </View>
  );
};

Config.navTitle = m.navTitle;

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
