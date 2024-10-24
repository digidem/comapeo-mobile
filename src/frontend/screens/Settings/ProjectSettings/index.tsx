import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {MenuList, MenuListItemType} from '../../../sharedComponents/MenuList';

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
});

export const ProjectSettings: NativeNavigationComponent<'ProjectSettings'> = ({
  navigation,
}) => {
  const {formatMessage} = useIntl();

  const MenuItems: MenuListItemType[] = [
    {
      onPress: () => {
        navigation.navigate('DeviceNameDisplay');
      },
      primaryText: formatMessage(m.deviceName),
      testID: 'PROJECT.device-name-list-item',
    },
    {
      onPress: () => {
        navigation.navigate('YourTeam');
      },
      primaryText: formatMessage(m.yourTeam),
      testID: 'MAIN.team-list-item',
    },
    {
      onPress: () => {
        navigation.navigate('Config');
      },
      primaryText: formatMessage(m.config),
      testID: 'settingsConfigButton',
    },
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

  return (
    <MenuList
      contentContainerStyle={{padding: 20, paddingTop: 40}}
      data={MenuItems}
    />
  );
};

ProjectSettings.navTitle = m.title;
