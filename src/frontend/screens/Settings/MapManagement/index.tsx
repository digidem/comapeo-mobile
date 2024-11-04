import React from 'react';
import {type NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {defineMessages, useIntl, type MessageDescriptor} from 'react-intl';
import {ScrollView} from 'react-native';

import {List, ListItem, ListItemText} from '../../../sharedComponents/List';
import {type NativeRootNavigationProps} from '../../../sharedTypes/navigation';

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
  return (
    <ScrollView>
      <List>
        <ListItem
          onPress={() => {
            navigation.navigate('BackgroundMaps');
          }}>
          <ListItemText primary={t(m.backgroundMaps)} />
        </ListItem>
      </List>
    </ScrollView>
  );
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
