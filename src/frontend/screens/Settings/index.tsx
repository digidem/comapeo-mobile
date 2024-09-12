import * as React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '../../sharedComponents/List';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const m = defineMessages({
  settingsTitle: {
    id: 'screens.Settings.title',
    defaultMessage: 'Settings',
    description: 'Title of settings screen',
  },
  aboutCoMapeo: {
    id: 'screens.Settings.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
    description: "Primary text for 'About CoMapeo' link (version info)",
  },
  aboutCoMapeoDesc: {
    id: 'screens.Settings.aboutCoMapeoDesc',
    defaultMessage: 'Version and build number',
    description: "Description of the 'About CoMapeo' page",
  },
  createOrJoin: {
    id: 'screens.Settings.createOrJoin',
    defaultMessage: 'Create or Join Project',
  },
  createOrJoinDesc: {
    id: 'screens.Settings.createOrJoinDesc',
    defaultMessage: 'Create a new project or join existing one',
  },
  projectSettings: {
    id: 'screens.Settings.projectSettings',
    defaultMessage: 'Project Settings',
  },
  projectSettingsDesc: {
    id: 'screens.Settings.projectSettingsDesc',
    defaultMessage: 'Categories, Config, Team',
    description: 'list of avaialable project settings',
  },
  appSettings: {
    id: 'screens.Settings.appSettings',
    defaultMessage: 'App Settings',
  },
  appSettingsDesc: {
    id: 'screens.Settings.appSettingsDesc',
    defaultMessage: 'Language, Security, Coordinates',
    description: 'list of avaialable app settings',
  },
});

export const Settings: NativeNavigationComponent<'Settings'> = () => {
  const {navigate} = useNavigationFromRoot();

  return (
    <ScrollView>
      <List>
        <ListItem
          onPress={() => {
            navigate('CreateOrJoinProject');
          }}>
          <ListItemIcon
            icon={
              <MaterialCommunityIcons
                name="shape-square-rounded-plus"
                size={24}
                color="rgba(0, 0, 0, 0.54)"
              />
            }
          />
          <ListItemText
            primary={<FormattedMessage {...m.createOrJoin} />}
            secondary={<FormattedMessage {...m.createOrJoinDesc} />}
          />
        </ListItem>
        <ListItem
          onPress={() => {
            navigate('ProjectSettings');
          }}>
          <ListItemIcon iconName="assignment" />
          <ListItemText
            primary={<FormattedMessage {...m.projectSettings} />}
            secondary={<FormattedMessage {...m.projectSettingsDesc} />}
          />
        </ListItem>
        <ListItem
          onPress={() => {
            navigate('AppSettings');
          }}>
          <ListItemIcon iconName="settings-suggest" />
          <ListItemText
            primary={<FormattedMessage {...m.appSettings} />}
            secondary={<FormattedMessage {...m.appSettingsDesc} />}
          />
        </ListItem>
        <ListItem
          onPress={() => {
            navigate('AboutSettings');
          }}
          testID="settingsAboutButton">
          <ListItemIcon iconName="info-outline" />
          <ListItemText
            primary={<FormattedMessage {...m.aboutCoMapeo} />}
            secondary={<FormattedMessage {...m.aboutCoMapeoDesc} />}
          />
        </ListItem>
        {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
          <ListItem
            onPress={() => {
              navigate('CreateTestData');
            }}
            testID="settingsCreateTestDataButton">
            <ListItemIcon iconName="auto-fix-high" />
            <ListItemText primary="Create Test Data" />
          </ListItem>
        )}
      </List>
    </ScrollView>
  );
};

Settings.navTitle = m.settingsTitle;
