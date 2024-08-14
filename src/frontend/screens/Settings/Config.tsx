import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import {useProjectSettings} from '../../hooks/server/projects';
import {Loading} from '../../sharedComponents/Loading';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';

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
});

export const Config: NativeNavigationComponent<'Config'> = () => {
  const {formatMessage} = useIntl();
  const {data, isPending} = useProjectSettings();

  if (!data || isPending) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text>{formatMessage(m.projectName)}</Text>
      <Text>{data.name}</Text>
      {data.configMetadata && (
        <>
          <Text>{formatMessage(m.name)}</Text>
          <Text>
            {formatMessage(m.created, {
              date: formatDate(data.configMetadata.buildDate),
              time: formatHours(data.configMetadata.buildDate),
            })}
          </Text>
          <Text>{data.configMetadata.name}</Text>
        </>
      )}
    </View>
  );
};

Config.navTitle = m.navTitle;

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
