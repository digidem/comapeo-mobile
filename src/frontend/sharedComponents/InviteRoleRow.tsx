import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {BodyText} from './Text/BodyText';
import {NEW_DARK_GREY} from '../lib/styles';

const m = defineMessages({
  coordinator: {
    id: 'sharedComponents.InviteRoleRow.coordinator',
    defaultMessage: 'Coordinator',
  },
  participant: {
    id: 'sharedComponents.InviteRoleRow.participant',
    defaultMessage: 'Participant',
  },
});

/** The role an invite grants, sized to sit under a ProjectCard's name. */
export function InviteRoleRow({isCoordinator}: {isCoordinator: boolean}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.row}>
      <MaterialIcon
        name={isCoordinator ? 'manage-accounts' : 'people'}
        size={20}
        color={NEW_DARK_GREY}
      />
      <BodyText style={styles.label}>
        {t(isCoordinator ? m.coordinator : m.participant)}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: NEW_DARK_GREY,
  },
});
