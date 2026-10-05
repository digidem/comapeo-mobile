import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import TrashCan from '../../../images/TrashCan.svg';
import {DARK_GREEN, WHITE} from '../../../lib/styles';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const SHORT_ID_LENGTH = 7;
const BADGE_SIZE = 30;

const m = defineMessages({
  deleted: {
    id: 'screens.YourTeam.InviteLinkDeleted.deleted',
    defaultMessage: 'Deleted',
  },
  hasBeenDeleted: {
    id: 'screens.YourTeam.InviteLinkDeleted.hasBeenDeleted',
    defaultMessage: '<bold>Invite {shortId}</bold> has been deleted.',
  },
  returnToTeam: {
    id: 'screens.YourTeam.InviteLinkDeleted.returnToTeam',
    defaultMessage: 'Return to Team',
  },
});

export function InviteLinkDeleted({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteLinkDeleted'>) {
  const {formatMessage: t} = useIntl();
  const shortId = route.params.inviteId.slice(0, SHORT_ID_LENGTH);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View>
          <TrashCan width={80} />
          <View style={styles.badge}>
            <MaterialIcon name="check" size={22} color={WHITE} />
          </View>
        </View>

        <HeaderText variant="header1">{t(m.deleted)}</HeaderText>

        <BodyText>
          <FormattedMessage
            {...m.hasBeenDeleted}
            values={{
              shortId,
              bold: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        </BodyText>
      </View>

      <SecondaryButton
        fullSize
        text={t(m.returnToTeam)}
        onPress={() => navigation.navigate('YourTeam')}
        renderIcon={({color, size}) => (
          <MaterialIcon name="people" size={size} color={color} />
        )}
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
  },
  badge: {
    position: 'absolute',
    right: -14,
    bottom: 0,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: DARK_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
