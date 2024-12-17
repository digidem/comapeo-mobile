import React from 'react';
import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {type NativeRootNavigationProps} from '../../../sharedTypes/navigation';
import {FullScreenMenuList} from '../../../sharedComponents/MenuList/FullScreenMenuList';
import {MenuListItemType} from '../../../sharedComponents/MenuList/MenuListItem';

const m = defineMessages({
  screenTitle: {
    id: 'screens.Settings.MapManagement.screenTitle',
    defaultMessage: 'Map Management',
  },
  backgroundMaps: {
    id: 'screens.Settings.MapManagement.backgroundMaps',
    defaultMessage: 'Background Maps',
  },
});

export function MapManagementScreen({
  navigation,
}: NativeRootNavigationProps<'MapManagement'>) {
  const {formatMessage: t} = useIntl();

  const menuItems: MenuListItemType[] = [
    {
      onPress: () => {
        navigation.navigate('BackgroundMaps');
      },
      primaryText: t(m.backgroundMaps),
    },
  ];

  return <FullScreenMenuList data={menuItems} />;
}

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}): (
  props: NativeRootNavigationProps<'MapManagement'>,
) => NativeStackNavigationOptions {
  return () => {
    return {
      title: intl(m.screenTitle),
    };
  };
}
