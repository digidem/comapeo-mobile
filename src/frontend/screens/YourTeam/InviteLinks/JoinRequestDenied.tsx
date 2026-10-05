import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {DARK_GREEN, DARK_ORANGE, WHITE} from '../../../lib/styles';
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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
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

        <HeaderText variant="header1" style={styles.title}>
          {t(m.denied)}
        </HeaderText>

        <BodyText style={styles.description}>{t(m.createNewLink)}</BodyText>
      </View>

      <SecondaryButton
        fullSize
        text={t(m.close)}
        onPress={() => navigation.navigate('YourTeam')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
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
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
