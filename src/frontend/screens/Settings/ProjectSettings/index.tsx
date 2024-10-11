import * as React from 'react';
import {ScrollView} from 'react-native';
import {List, ListItem, ListItemText} from '../../../sharedComponents/List';
import {FormattedMessage, defineMessages} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useGetRemoteArchives} from '../../../hooks/server/projects';
import {UIActivityIndicator} from 'react-native-indicators';

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
    id: 'screens.Settings.config',
    defaultMessage: 'Project Configuration',
    description: 'Primary text for project config settings',
  },
  RemoteArchive: {
    id: 'Screens.Settings.ProjectSettings.RemoteArchive',
    defaultMessage: 'Remote Archive',
  },
  remoteArchiveOff: {
    id: 'Screens.Settings.ProjectSettings.remoteArchiveOff',
    defaultMessage: 'Remote Archive is OFF',
  },
  remoteArchiveOn: {
    id: 'Screens.Settings.ProjectSettings.remoteArchiveOn',
    defaultMessage: 'Remote Archive is ON',
  },
});

export const ProjectSettings: NativeNavigationComponent<'ProjectSettings'> = ({
  navigation,
}) => {
  const {data: remoteArchives, isPending} = useGetRemoteArchives();

  const remoteArchiveOn = remoteArchives && remoteArchives.length > 0;
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
        {!isPending && remoteArchives !== undefined ? (
          <ListItem
            onPress={() => {
              navigation.navigate(
                remoteArchiveOn ? 'RemoteArchiveOn' : 'RemoteArchiveOff',
              );
            }}
            testID="settingsConfigButton">
            <ListItemText
              primary={<FormattedMessage {...m.RemoteArchive} />}
              secondary={
                remoteArchiveOn ? (
                  <FormattedMessage {...m.remoteArchiveOn} />
                ) : (
                  <FormattedMessage {...m.remoteArchiveOff} />
                )
              }
            />
          </ListItem>
        ) : (
          <UIActivityIndicator style={{alignSelf: 'flex-start', padding: 20}} />
        )}
      </List>
    </ScrollView>
  );
};

ProjectSettings.navTitle = m.title;
