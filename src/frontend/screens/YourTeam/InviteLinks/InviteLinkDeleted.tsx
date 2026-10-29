import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {ScreenContentWithDock} from '../../../sharedComponents/ScreenContentWithDock';
import {IconTitleDescription} from '../../../sharedComponents/IconTitleDescription';
import {SecondaryButton} from '../../../sharedComponents/Buttons';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import TrashCan from '../../../images/TrashCan.svg';
import {DARK_GREEN, WHITE} from '../../../lib/styles';
import {usePreventBackNavigation} from '../../../hooks/usePreventBackNavigation';
import type {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

const SHORT_ID_LENGTH = 7;
const ICON_SIZE = 80;
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
  usePreventBackNavigation();
  const shortId = route.params.inviteId.slice(0, SHORT_ID_LENGTH);

  return (
    <ScreenContentWithDock
      contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
      dockContent={
        <SecondaryButton
          fullSize
          text={t(m.returnToTeam)}
          onPress={() => navigation.popTo('YourTeam')}
          renderIcon={({color, size}) => (
            <MaterialIcon name="people" size={size} color={color} />
          )}
        />
      }>
      <IconTitleDescription
        icon={
          <View>
            <TrashCan width={ICON_SIZE} />
            <View style={styles.badge}>
              <MaterialIcon name="check" size={22} color={WHITE} />
            </View>
          </View>
        }
        title={t(m.deleted)}
        titleVariant="header1"
        description={
          <FormattedMessage
            {...m.hasBeenDeleted}
            values={{
              shortId,
              bold: (chunks: React.ReactNode) => (
                <HeaderText variant="header5">{chunks}</HeaderText>
              ),
            }}
          />
        }
      />
    </ScreenContentWithDock>
  );
}

const styles = StyleSheet.create({
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
