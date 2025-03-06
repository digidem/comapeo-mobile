import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import {View, Text} from 'react-native';
import {VERY_LIGHT_GREY, WHITE} from '../lib/styles';
import {useProjectSettings} from '../hooks/server/projects';
import {DrawerMenuIcon} from './icons/DrawerMenuIcon';
import {MenuListItem} from './MenuList/MenuListItem';
import {Divider} from './Divider';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import Animated, {SlideInRight, SlideOutRight} from 'react-native-reanimated';

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

export const DrawerContent = ({closeDrawer}: {closeDrawer: () => void}) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const {navigate} = useNavigationFromRoot();

  return (
    <Animated.View
      style={{
        flexGrow: 1,
        paddingBottom: 0,
        paddingStart: 0,
        paddingEnd: 0,
        width: '80%',
        alignSelf: 'flex-end',
      }}
      entering={SlideInRight.duration(250)}
      exiting={SlideOutRight.duration(250)}>
      <View
        style={{
          paddingBottom: 40,
          backgroundColor: VERY_LIGHT_GREY,
        }}>
        <DrawerMenuIcon
          style={{alignSelf: 'flex-end', marginRight: 20, paddingTop: 20}}
          onPress={closeDrawer}
          testID="drawer-icon-drawer"
          accessibilityLabel="Close Navigation Drawer"
        />
        {/* This text component is one of the exceptions that does not use the shared text components as requested by Sabella */}
        <Text
          testID="MAIN.drawer-create-join-txt"
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            paddingHorizontal: 40,
            fontSize: 18,
            fontFamily: 'Rubik_400Regular',
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
                navigate('CreateOrJoinProject');
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
                navigate('ProjectSettings');
              },
              materialIconName: 'assignment',
              primaryText: formatMessage(m.projectSettings),
            }}
          />
          <DrawerMenuListItem
            item={{
              onPress: () => {
                navigate('AppSettings');
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
                <EntypoIcon name="lock" size={24} color="rgba(0, 0, 0, 0.54)" />
              ),
              primaryText: formatMessage(m.privacyPolicy),
            }}
          />
        </View>
      </View>
    </Animated.View>
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
