import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useAuthContext} from '../../../contexts/AuthContext';
import {FullScreenMenuList} from '../../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../../sharedComponents/MenuList/MenuListItem';

const m = defineMessages({
  title: {
    id: 'Screens.Settings.AppSettings.title',
    defaultMessage: 'App Settings',
  },
  language: {
    id: 'Screens.Settings.AppSettings.language',
    defaultMessage: 'Language',
  },
  languageDesc: {
    id: 'Screens.Settings.AppSettings.languageDesc',
    defaultMessage: 'Display language for app',
  },
  coordinateSystem: {
    id: 'Screens.Settings.AppSettings.coordinateSystem',
    defaultMessage: 'Coordinate System',
  },
  coordinateSystemDesc: {
    id: 'Screens.Settings.AppSettings.coordinateSystemDesc',
    defaultMessage: 'UTM,Lat/Lon,DMS',
  },
  mapManagement: {
    id: 'Screens.Settings.AppSettings.mapManagement',
    defaultMessage: 'Background Map',
  },
  security: {
    id: 'Screens.Settings.AppSettings.Drawer.security',
    defaultMessage: 'Security',
  },
  deviceName: {
    id: 'Screens.Settings.AppSettings.deviceName',
    defaultMessage: 'Device Name',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  const {authState} = useAuthContext();
  const {formatMessage} = useIntl();
  const MenuItems: MenuListItemType[] = [
    {
      onPress: () => {
        navigation.navigate('DeviceNameDisplay');
      },
      testID: 'device-name-list-item',
      primaryText: formatMessage(m.deviceName),
      materialIconName: 'phone-android',
    },
    {
      onPress: () => {
        navigation.navigate('LanguageSettings');
      },
      primaryText: formatMessage(m.language),
      secondaryText: formatMessage(m.languageDesc),
      materialIconName: 'language',
    },
    {
      onPress: () => {
        navigation.navigate('CoordinateFormat');
      },
      testID: 'settingsCoodinatesButton',
      primaryText: formatMessage(m.coordinateSystem),
      secondaryText: formatMessage(m.coordinateSystemDesc),
      materialIconName: 'explore',
    },
    {
      onPress: () => {
        navigation.navigate('BackgroundMaps');
      },
      testID: 'mapManagementButton',
      primaryText: formatMessage(m.mapManagement),
      materialIconName: 'map',
    },
    ...(authState !== 'obscured'
      ? [
          {
            onPress: () => {
              navigation.navigate('Security');
            },
            primaryText: formatMessage(m.security),
            materialIconName: 'security',
          },
        ]
      : []),
    ...(process.env.EXPO_PUBLIC_FEATURE_TEST_DATA_UI
      ? [
          {
            onPress: () => {
              navigation.navigate('CreateTestData');
            },
            primaryText: 'Create Test Data',
            materialIconName: 'auto-fix-high',
          },
        ]
      : []),
  ];
  return <FullScreenMenuList data={MenuItems} />;
};

AppSettings.navTitle = m.title;
