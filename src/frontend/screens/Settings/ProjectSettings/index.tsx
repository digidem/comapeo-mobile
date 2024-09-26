import * as React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, ListItemText} from '../../../sharedComponents/List';
import {FormattedMessage, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.ProjectSettings.title',
    defaultMessage: 'Project Settings',
  },
  deviceName: {
    id: 'Screens.Settings.ProjectSettings.deviceName',
    defaultMessage: 'Device Name',
  },
  yourTeam: {
    id: 'Screens.Settings.ProjectSettings.yourTeam',
    defaultMessage: 'Your Team',
  },
  mediaSyncSettings: {
    id: 'Screens.Settings.ProjectSettings.mediaSyncSettings',
    defaultMessage: 'Sync Settings',
  },
  config: {
    id: 'screens.Settings.ProjectSettings.config',
    defaultMessage: 'Project Configuration',
    description: 'Primary text for project config settings',
  },
  remoteArchive: {
    id: 'screens.Settings.ProjectSettings.remoteArchive',
    defaultMessage: 'Remote Archive',
  },
});

export const ProjectSettings: NativeNavigationComponent<'ProjectSettings'> = ({
  navigation,
}) => {
  return (
    <ScrollView>
      <List>
        <ListItem
          testID="PROJECT.device-name-list-item"
          onPress={() => {
            navigation.navigate('DeviceNameDisplay');
          }}>
          <ListItemText primary={<FormattedMessage {...m.deviceName} />} />
        </ListItem>
        <ListItem
          testID="MAIN.team-list-item"
          onPress={() => {
            navigation.navigate('YourTeam');
          }}>
          <ListItemText primary={<FormattedMessage {...m.yourTeam} />} />
        </ListItem>
        {process.env.EXPO_PUBLIC_FEATURE_MEDIA_MANAGER && (
          <ListItem
            testID="MAIN.sync-list-item"
            onPress={() => {
              navigation.navigate('MediaSyncSettings');
            }}>
            <ListItemText
              primary={<FormattedMessage {...m.mediaSyncSettings} />}
            />
          </ListItem>
        )}

        <ListItem
          onPress={() => {
            navigation.navigate('Config');
          }}
          testID="settingsConfigButton">
          <ListItemText primary={<FormattedMessage {...m.config} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('RemoteArchive');
          }}>
          <ListItemText primary={<FormattedMessage {...m.remoteArchive} />} />
        </ListItem>
      </List>
    </ScrollView>
  );
};

ProjectSettings.navTitle = m.title;
