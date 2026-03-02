import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useAuthContext} from '../../../contexts/AuthContext';
import {FullScreenMenuList} from '../../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../../sharedComponents/MenuList/MenuListItem';
import BlackShieldIcon from '../../../images/BlackShield.svg';
import {useEarlyAccessState} from '../../../contexts/EarlyAccessContext';

// primary-string ENTIRE SCREEN

const m = defineMessages({
  title: {
    id: 'Screens.Settings.AppSettings.title',
    defaultMessage: 'CoMapeo Settings',
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
  deviceName: {
    id: 'Screens.Settings.AppSettings.deviceName',
    defaultMessage: 'Device Name',
  },
  privacyPolicy: {
    id: 'Screens.Settings.AppSettings.privacyPolicy',
    defaultMessage: 'Data & Privacy',
  },
  aboutCoMapeo: {
    id: 'Screens.Settings.AppSettings.aboutCoMapeo',
    defaultMessage: 'About CoMapeo',
  },
  earlyAccessTitle: {
    id: 'Screens.Settings.AppSettings.earlyAccess',
    defaultMessage: 'Early Access Mode',
  },
  earlyAccessOn: {
    id: 'Screens.Settings.AppSettings.earlyAccess.on',
    defaultMessage: 'Early Access is ON',
  },
  earlyAccessOff: {
    id: 'Screens.Settings.AppSettings.earlyAccess.off',
    defaultMessage: 'Early Access is OFF',
  },
});

export const AppSettings: NativeNavigationComponent<'AppSettings'> = ({
  navigation,
}) => {
  const {authState} = useAuthContext();
  const {formatMessage} = useIntl();
  const isEarlyAccess = useEarlyAccessState(s => s.isEarlyAccessEnabled);
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
        navigation.navigate('DataAndPrivacy');
      },
      testID: 'dataAndPrivacyButton',
      primaryText: formatMessage(m.privacyPolicy),
      icon: <BlackShieldIcon width={24} height={24} />,
    },
    {
      onPress: () => {
        navigation.navigate('AboutSettings');
      },
      testID: 'aboutSettingsButton',
      primaryText: formatMessage(m.aboutCoMapeo),
      materialIconName: 'info-outline',
    },

    ...(process.env.EXPO_PUBLIC_FEATURE_EARLY_ACCESS
      ? [
          {
            onPress: () => {
              navigation.navigate('EarlyAccess');
            },
            testID: 'earlyAccessFlag',
            primaryText: formatMessage(m.earlyAccessTitle),
            secondaryText: isEarlyAccess
              ? formatMessage(m.earlyAccessOn)
              : formatMessage(m.earlyAccessOff),
            materialIconName: 'flag' as const,
          },
        ]
      : []),

    ...(authState !== 'obscured'
      ? [
          {
            onPress: () => {
              navigation.navigate('Security');
            },
            primaryText: formatMessage(m.security),
            materialIconName: 'security' as const,
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
            materialIconName: 'auto-fix-high' as const,
          },
        ]
      : []),
  ];
  return <FullScreenMenuList data={MenuItems} />;
};

AppSettings.navTitle = m.title;
