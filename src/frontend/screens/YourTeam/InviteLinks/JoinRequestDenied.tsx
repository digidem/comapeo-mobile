import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {DARK_GREEN, DARK_ORANGE, WHITE} from '../../../lib/styles';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const ICON_SIZE = 100;
const BADGE_SIZE = 34;

const m = defineMessages({
  denied: {
    id: 'screens.YourTeam.JoinRequestDenied.denied',
    defaultMessage: 'Request Denied',
  },
  createNewLink: {
    id: 'screens.YourTeam.JoinRequestDenied.createNewLink',
    defaultMessage: 'Create a new Invite Link to re-invite a device',
  },
  close: {
    id: 'screens.YourTeam.JoinRequestDenied.close',
    defaultMessage: 'Close',
  },
});

export function JoinRequestDenied({
  navigation,
}: NativeRootNavigationProps<'JoinRequestDenied'>) {
  const {formatMessage: t} = useIntl();
  usePreventBackNavigation();

  return (
    <ScreenContentWithDock
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      dockContent={
        <SecondaryButton
          fullSize
          text={t(m.close)}
          onPress={() => navigation.popTo('YourTeam')}
        />
      }>
      <IconTitleDescription
        icon={
          <View>
            <MaterialIcon
              name="remove-circle-outline"
              size={ICON_SIZE}
              color={DARK_ORANGE}
            />
            <View style={styles.badge}>
              <MaterialIcon name="check" size={24} color={WHITE} />
            </View>
          </View>
        }
        title={t(m.denied)}
        description={t(m.createNewLink)}
      />
    </ScreenContentWithDock>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: DARK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
