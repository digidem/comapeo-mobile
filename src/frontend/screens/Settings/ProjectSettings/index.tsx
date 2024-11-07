import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {
  useAllProjects,
  useGetRemoteArchives,
} from '../../../hooks/server/projects';
import {UIActivityIndicator} from 'react-native-indicators';
import {FullScreenMenuList} from '../../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../../sharedComponents/MenuList/MenuListItem';

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
    defaultMessage: 'Configuration',
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
  const {formatMessage} = useIntl();

  const {data: remoteArchives, isPending} = useGetRemoteArchives();

  const remoteArchiveOn = remoteArchives && remoteArchives.length > 0;

  const {data: projects} = useAllProjects();

  const MenuItems: MenuListItemType[] = [
    {
      onPress: () => {
        navigation.navigate('DeviceNameDisplay');
      },
      disabled: remoteArchives === undefined,
      primaryText: formatMessage(m.deviceName),
      testID: 'PROJECT.device-name-list-item',
    },
    {
      onPress: () => {
        navigation.navigate('Config');
      },
      primaryText: formatMessage(m.config),
      testID: 'settingsConfigButton',
    },
    {
      onPress: () => {
        navigation.navigate('YourTeam');
      },
      primaryText: formatMessage(m.yourTeam),
      testID: 'MAIN.team-list-item',
    },
    ...(projects && projects.length > 1
      ? [
          {
            onPress: () => {
              navigation.navigate(
                remoteArchiveOn ? 'RemoteArchiveOn' : 'RemoteArchiveOff',
              );
            },
            primaryText: formatMessage(m.RemoteArchive),
            secondaryText: isPending ? (
              <UIActivityIndicator size={25} />
            ) : remoteArchiveOn ? (
              formatMessage(m.remoteArchiveOn)
            ) : (
              formatMessage(m.remoteArchiveOff)
            ),
          },
        ]
      : []),
    ...(process.env.EXPO_PUBLIC_FEATURE_MEDIA_MANAGER
      ? [
          {
            onPress: () => {
              navigation.navigate('MediaSyncSettings');
            },
            primaryText: formatMessage(m.mediaSyncSettings),
            testID: 'AIN.sync-list-item',
          },
        ]
      : []),
  ];

  return <FullScreenMenuList data={MenuItems} />;
};

ProjectSettings.navTitle = m.title;
