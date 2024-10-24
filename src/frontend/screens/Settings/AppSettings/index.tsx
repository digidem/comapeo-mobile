import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useSecurityContext} from '../../../contexts/SecurityContext';
import {
  FullScreenMenuList,
  MenuListItemType,
} from '../../../sharedComponents/MenuList';

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
  security: {
    id: 'Screens.Settings.AppSettings.Drawer.security',
    defaultMessage: 'Security',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  const {authState} = useSecurityContext();
  const {formatMessage} = useIntl();
  const MenuItems: MenuListItemType[] = [
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
  ];
  return <FullScreenMenuList data={MenuItems} />;
};

AppSettings.navTitle = m.title;
