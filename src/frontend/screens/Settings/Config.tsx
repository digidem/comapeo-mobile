import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import {useProjectSettings} from '../../hooks/server/projects';
import {Loading} from '../../sharedComponents/Loading';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {COMAPEO_BLUE, MEDIUM_GREY} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {UIActivityIndicator} from 'react-native-indicators';
import {ErrorBottomSheet} from '../../sharedComponents/ErrorBottomSheet';
import {useSelectFileAndImportConfig} from '../../hooks/useSelectFileAndImportConfig';

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

  const selectAndImportConfigMutation = useSelectFileAndImportConfig();

  React.useEffect(() => {
    // Prevent back navigation while project creation mutation is pending
    const unsubscribe = navigation.addListener('beforeRemove', event => {
      if (!selectAndImportConfigMutation.isPending) {
        return;
      }

      event.preventDefault();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, selectAndImportConfigMutation.isPending]);

  async function importConfigFile() {
    selectAndImportConfigMutation.mutate();
  }

  if (!data || isPending) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {data.name && (
        <>
          <Text>{formatMessage(m.projectName)}</Text>
          <Text style={{marginBottom: 20}}>{data.name}</Text>
        </>
      )}
      {data.configMetadata && (
        <>
          <Text>{formatMessage(m.name)}</Text>
          <Text style={{color: MEDIUM_GREY}}>
            {formatMessage(m.created, {
              date: formatDate(data.configMetadata.buildDate),
              time: formatHours(data.configMetadata.buildDate),
            })}
          </Text>
          <Text>{data.configMetadata.name}</Text>
        </>
      )}
      {!selectAndImportConfigMutation.isPending ? (
        <Button
          style={{marginTop: 20}}
          fullWidth
          variant="outlined"
          onPress={importConfigFile}>
          <Text style={{color: COMAPEO_BLUE}}>
            {formatMessage(m.importConfig)}
          </Text>
        </Button>
      ) : (
        <UIActivityIndicator style={{marginTop: 20, flex: 0}} />
      )}
      <ErrorBottomSheet
        error={selectAndImportConfigMutation.error}
        clearError={() => {
          selectAndImportConfigMutation.reset();
        }}
        tryAgain={importConfigFile}
      />
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
