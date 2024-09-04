import * as React from 'react';
import {ScrollView} from 'react-native';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '../../../sharedComponents/List';
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
  syncSettings: {
    id: 'Screens.Settings.ProjectSettings.syncSettings',
    defaultMessage: 'Sync Settings',
  },
  config: {
    id: 'screens.Settings.config',
    defaultMessage: 'Project Configuration',
    description: 'Primary text for project config settings',
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
        <ListItem
          testID="MAIN.sync-list-item"
          onPress={() => {
            navigation.navigate('SyncSettings');
          }}>
          <ListItemText primary={<FormattedMessage {...m.syncSettings} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigation.navigate('Config');
          }}
          testID="settingsConfigButton">
          <ListItemIcon
            style={{minWidth: 0, marginRight: 10}}
            iconName="assignment"
          />
          <ListItemText primary={<FormattedMessage {...m.config} />} />
        </ListItem>
      </List>
    </ScrollView>
  );
};

ProjectSettings.navTitle = m.title;
