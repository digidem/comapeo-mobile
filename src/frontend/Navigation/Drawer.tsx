import * as React from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {defineMessages, useIntl} from 'react-intl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {NavigatorScreenParams} from '@react-navigation/native';
import {View} from 'react-native';
import {Text} from '../sharedComponents/Text';
import {VERY_LIGHT_GREY, WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';
import {AppStackParamsList} from '../sharedTypes/navigation';
import {RootStackNavigator} from './Stack';
import {DrawerMenuIcon} from '../sharedComponents/icons/DrawerMenuIcon';
import {MenuListItem} from '../sharedComponents/MenuList/MenuListItem';
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
    defaultMessage: 'Privacy Policy',
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
        // the child (DrawerContent) is setting the background color
        drawerStyle: {width: '100%', backgroundColor: 'transparent'},
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
    // By default, the drawer content only takes up some of the screen, if the user clicks outside of the drawer content, it causes the drawer to close. The api does not allow us to stop this behaviour
    // As a workaround, I am setting a transparent background that takes up the entire screen, and putting the menu on top of that. This blocks the user from clicking outside of the menu as the transparent background is techincally still the menu.
    <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0)'}}>
      <DrawerContentScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={{
          backgroundColor: VERY_LIGHT_GREY,
          width: '80%',
          alignSelf: 'flex-end',
        }}>
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
            variant="primary"
            style={{
              alignSelf: 'center',
              textAlign: 'center',
              paddingHorizontal: 40,
              fontSize: 18,
            }}>
            {data?.name
              ? formatMessage(m.projName, {projectName: data.name})
              : formatMessage(m.mappingOnOwn)}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: WHITE,
            justifyContent: 'space-between',
            flex: 1,
            paddingVertical: 10,
          }}>
          <View>
            <DrawerMenuListItem
              item={{
                onPress: () => {
                  navigate('DrawerHome', {screen: 'CreateOrJoinProject'});
                },
                icon: (
                  <MaterialCommunityIcons
                    name="shape-square-rounded-plus"
                    size={24}
                    color="rgba(0, 0, 0, 0.54)"
                  />
                ),
                primaryText: formatMessage(m.createOrJoin),
                testID: 'MAIN.create-join-list-item',
              }}
            />
            <DrawerMenuListItem
              item={{
                onPress: () => {
                  navigate('DrawerHome', {screen: 'ProjectSettings'});
                },
                materialIconName: 'assignment',
                primaryText: formatMessage(m.projectSettings),
                testID: 'MAIN.project-stg-list-item',
              }}
            />
            <DrawerMenuListItem
              item={{
                onPress: () => {
                  navigate('DrawerHome', {screen: 'AppSettings'});
                },
                materialIconName: 'settings-suggest',
                primaryText: formatMessage(m.appSettings),
              }}
            />
            {process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI && (
              <DrawerMenuListItem
                item={{
                  onPress: () => {
                    navigate('CreateTestData');
                  },
                  materialIconName: 'auto-fix-high',
                  primaryText: 'Create Test Data',
                }}
              />
            )}
          </View>
          <View>
            <Divider />
            <DrawerMenuListItem
              item={{
                onPress: () => {
                  navigate('AboutSettings');
                },
                materialIconName: 'info-outline',
                primaryText: formatMessage(m.aboutCoMapeo),
              }}
            />
            <DrawerMenuListItem
              item={{
                onPress: () => {
                  navigate('DataAndPrivacy');
                },
                icon: (
                  <EntypoIcon
                    name="lock"
                    size={24}
                    color="rgba(0, 0, 0, 0.54)"
                  />
                ),
                primaryText: formatMessage(m.privacyPolicy),
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

function DrawerMenuListItem(
  props: Omit<
    React.ComponentProps<typeof MenuListItem>,
    'paddingLeft' | 'paddingRight' | 'columnGap'
  >,
) {
  return (
    <MenuListItem
      {...props}
      style={{paddingTop: 10, paddingBottom: 10}}
      paddingLeft={15}
      paddingRight={15}
      columnGap={15}
    />
  );
}
