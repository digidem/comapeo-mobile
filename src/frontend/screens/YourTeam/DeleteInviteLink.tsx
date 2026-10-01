import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import MaterialIcon from '@react-native-vector-icons/material-icons';

import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import {useCancelInviteLink} from '../../hooks/useInviteLinks';
import {WARNING_RED} from '../../lib/styles';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: 'screens.YourTeam.DeleteInviteLink.title',
    defaultMessage: 'Delete Invite Link?',
  },
  description: {
    id: 'screens.YourTeam.DeleteInviteLink.description',
    defaultMessage:
      'This link will no longer work for new devices joining the project.',
  },
  confirm: {
    id: 'screens.YourTeam.DeleteInviteLink.confirm',
    defaultMessage: 'Yes, Delete',
  },
  cancel: {
    id: 'screens.YourTeam.DeleteInviteLink.cancel',
    defaultMessage: 'Cancel',
  },
});

export function DeleteInviteLink({
  route,
  navigation,
}: NativeRootNavigationProps<'DeleteInviteLink'>) {
  const {formatMessage: t} = useIntl();
  const {url, inviteId} = route.params;
  const cancelInviteLink = useCancelInviteLink();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    await cancelInviteLink(url);
    navigation.replace('InviteLinkDeleted', {inviteId});
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <IconTitleDescription
          icon={<MaterialIcon name="error" size={60} color={WARNING_RED} />}
          title={t(m.title)}
          description={t(m.description)}
        />

        <View style={styles.buttonContainer}>
          {isDeleting ? (
            <LoadingIndicator />
          ) : (
            <>
              <DestructiveButton
                fullSize
                text={t(m.confirm)}
                onPress={confirmDelete}
                renderIcon={({color, size}) => (
                  <MaterialIcon name="delete" size={size} color={color} />
                )}
              />
              <SecondaryButton
                fullSize
                text={t(m.cancel)}
                onPress={() => navigation.goBack()}
              />
            </>
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingTop: 18,
    gap: 12,
  },
});
