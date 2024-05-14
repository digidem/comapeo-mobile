import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '../sharedComponents/List';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {NavigatorScreenParams} from '@react-navigation/native';
import {IconButton} from '../sharedComponents/IconButton';
import {View} from 'react-native';
import {Text} from '../sharedComponents/Text';
import {LIGHT_GREY, WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {RootStackNavigator} from './Stack';

const m = defineMessages({
  settingsTitle: {
    id: 'Navigation.Drawer.title',
    defaultMessage: 'Settings',
    description: 'Title of settings screen',
  },
  aboutMapeo: {
    id: 'Navigation.Drawer.aboutMapeo',
    defaultMessage: 'About Mapeo',
    description: "Primary text for 'About Mapeo' link (version info)",
  },
  aboutMapeoDesc: {
    id: 'Navigation.Drawer.aboutMapeoDesc',
    defaultMessage: 'Version and build number',
    description: "Description of the 'About Mapeo' page",
  },
  createOrJoin: {
    id: 'Navigation.Drawer.createOrJoin',
    defaultMessage: 'Create or Join Project',
  },
  createOrJoinDesc: {
    id: 'Navigation.Drawer.createOrJoinDesc',
    defaultMessage: 'Create a new project or join existing one',
  },
  projectSettings: {
    id: 'Navigation.Drawer.projectSettings',
    defaultMessage: 'Project Settings',
  },
  projectSettingsDesc: {
    id: 'Navigation.Drawer.projectSettingsDesc',
    defaultMessage: 'Categories, Config, Team',
    description: 'list of avaialable project settings',
  },
  appSettings: {
    id: 'Navigation.Drawer.appSettings',
    defaultMessage: 'App Settings',
  },
  appSettingsDesc: {
    id: 'Navigation.Drawer.appSettingsDesc',
    defaultMessage: 'Language, Security, Coordinates',
    description: 'list of avaialable app settings',
  },
  projName: {
    id: 'Navigation.Drawer.projName',
    defaultMessage: 'Project {projectName}',
  },
  createOrJoinToSync: {
    id: 'Navigation.Drawer.createOrJoinToSync',
    defaultMessage: 'Create or Join a Project to sync with other devices',
  },
});

export type DrawerScreens = {
  DrawerHome: NavigatorScreenParams<AppStackParamsList>;
};

const Drawer = createDrawerNavigator<DrawerScreens>();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        swipeEnabled: false,
      }}
      drawerContent={DrawerContent}
      initialRouteName="DrawerHome">
      <Drawer.Screen name="DrawerHome" component={RootStackNavigator} />
    </Drawer.Navigator>
  );
};

const DrawerContent = ({navigation}: DrawerContentComponentProps) => {
  const {navigate} = navigation;
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  return (
    <DrawerContentScrollView style={{}}>
      <View
        style={{
          backgroundColor: LIGHT_GREY,
          paddingBottom: 40,
        }}>
        <IconButton
          style={{alignSelf: 'flex-end'}}
          onPress={navigation.closeDrawer}>
          <MaterialIcon name="menu" size={32} />
        </IconButton>
        <Text style={{alignSelf: 'center', textAlign: 'center'}}>
          {data?.name
            ? formatMessage(m.projName, {projectName: data.name})
            : formatMessage(m.createOrJoinToSync)}
        </Text>
      </View>
      <List
        style={{
          backgroundColor: WHITE,
          height: '100%',
        }}>
        <ListItem
          onPress={() => {
            navigate('DrawerHome', {screen: 'CreateOrJoinProject'});
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
          <ListItemText primary={<FormattedMessage {...m.createOrJoin} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigate('DrawerHome', {screen: 'ProjectSettings'});
          }}>
          <ListItemIcon iconName="assignment" />
          <ListItemText primary={<FormattedMessage {...m.projectSettings} />} />
        </ListItem>
        <ListItem
          onPress={() => {
            navigate('DrawerHome', {screen: 'AppSettings'});
          }}>
          <ListItemIcon iconName="settings-suggest" />
          <ListItemText primary={<FormattedMessage {...m.appSettings} />} />
        </ListItem>
      </List>
    </DrawerContentScrollView>
  );
};