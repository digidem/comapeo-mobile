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
import {NavigatorScreenParams} from '@react-navigation/native';
import {View} from 'react-native';
import {Text} from '../sharedComponents/Text';
import {VERY_LIGHT_GREY, WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {RootStackNavigator} from './Stack';
import {DrawerMenuIcon} from '../sharedComponents/icons/DrawerMenuIcon';
import {Divider} from '../sharedComponents/Divider';

const m = defineMessages({
  settingsTitle: {
    id: 'Navigation.Drawer.title',
    defaultMessage: 'Settings',
    description: 'Title of settings screen',
  },
  aboutCoMapeo: {
    id: 'Navigation.Drawer.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
    description: "Primary text for 'About CoMapeo' link (version info)",
  },
  aboutCoMapeoDesc: {
    id: 'Navigation.Drawer.aboutCoMapeoDesc',
    defaultMessage: 'Version and build number',
    description: "Description of the 'About CoMapeo' page",
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
  privacyPolicy: {
    id: 'Navigation.Drawer.privacyPolicy',
    defaultMessage: 'Data & Privacy',
  },
  projName: {
    id: 'Navigation.Drawer.projName',
    defaultMessage: 'Project {projectName}',
  },
  mappingOnOwn: {
    id: 'Navigation.Drawer.mappingOnOwn',
    defaultMessage: 'You are currently mapping on your own',
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
    <DrawerContentScrollView
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor: VERY_LIGHT_GREY, flex: 1}}>
      <View
        style={{
          paddingBottom: 40,
        }}>
        <DrawerMenuIcon
          style={{alignSelf: 'flex-end', marginRight: 20}}
          onPress={navigation.closeDrawer}
        />
        <Text
          testID="MAIN.drawer-create-join-txt"
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            paddingHorizontal: 40,
            fontSize: 20,
          }}>
          {data?.name
            ? formatMessage(m.projName, {projectName: data.name})
            : formatMessage(m.mappingOnOwn)}
        </Text>
      </View>
      <List
        style={{
          backgroundColor: WHITE,
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <View>
          <ListItem
            testID="MAIN.create-join-list-item"
            onPress={() => {
              navigate('DrawerHome', {screen: 'CreateOrJoinProject'});
            }}>
            <DrawerListItemIcon
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
            testID="MAIN.project-stg-list-item"
            onPress={() => {
              navigate('DrawerHome', {screen: 'ProjectSettings'});
            }}>
            <DrawerListItemIcon iconName="assignment" />
            <ListItemText
              primary={<FormattedMessage {...m.projectSettings} />}
            />
          </ListItem>
          <ListItem
            onPress={() => {
              navigate('DrawerHome', {screen: 'AppSettings'});
            }}>
            <DrawerListItemIcon iconName="settings-suggest" />
            <ListItemText primary={<FormattedMessage {...m.appSettings} />} />
          </ListItem>
          {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
            <ListItem
              onPress={() => {
                navigate('CreateTestData');
              }}
              testID="settingsCreateTestDataButton">
              <DrawerListItemIcon iconName="auto-fix-high" />
              <ListItemText primary="Create Test Data" />
            </ListItem>
          )}
        </View>
        <View>
          <Divider />
          <ListItem
            onPress={() => {
              navigate('AboutSettings');
            }}
            testID="settingsAboutButton">
            <DrawerListItemIcon iconName="info-outline" />
            <ListItemText primary={<FormattedMessage {...m.aboutCoMapeo} />} />
          </ListItem>
          <ListItem
            onPress={() => {
              navigate('DataAndPrivacy');
            }}>
            <DrawerListItemIcon iconName="privacy-tip" />
            <ListItemText primary={<FormattedMessage {...m.privacyPolicy} />} />
          </ListItem>
        </View>
      </List>
    </DrawerContentScrollView>
  );
};

function DrawerListItemIcon(props: React.ComponentProps<typeof ListItemIcon>) {
  return <ListItemIcon {...props} style={{minWidth: 0, marginRight: 10}} />;
}
