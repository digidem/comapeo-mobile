import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {useAcceptInvite, useRejectInvite} from '../../hooks/server/invites';
import InviteIcon from '../../images/AddPersonCircle.svg';
import {LIGHT_GREY} from '../../lib/styles';
import {BottomSheetModalContent} from '../BottomSheetModal';

const m = defineMessages({
  declineInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.PendingInviteContent.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  acceptInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.PendingInviteContent.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  joinProject: {
    id: 'sharedComponents.ProjectInviteBottomSheet.PendingInviteContent.joinProject',
    defaultMessage: 'Join Project {projectName}',
  },
  invitedToJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.PendingInviteContent.invitedToJoin',
    defaultMessage: "You've been invited to join {projectName}",
  },
});

export function InvitePendingContent({
  projectName,
  inviteId,
  onReject,
}: {
  projectName: string;
  inviteId: string;
  onReject: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState<Error | null>(null);

  const accept = useAcceptInvite();
  const reject = useRejectInvite();

  const isLoading = accept.isPending || reject.isPending;

  // TODO: Display error state

  return (
    <BottomSheetModalContent
      loading={isLoading}
      buttonConfigs={[
        {
          variation: 'outlined',
          onPress: () => {
            reject.mutate(
              {inviteId},
              {
                onSuccess: () => {
                  onReject();
                },
                onError: err => {
                  setError(err);
                },
              },
            );
          },
          text: t(m.declineInvite),
        },
        {
          variation: 'filled',
          onPress: () => {
            accept.mutate(
              {inviteId},
              {
                onError: err => {
                  setError(err);
                },
              },
            );
          },
          text: t(m.acceptInvite),
        },
      ]}
      title={t(m.joinProject, {projectName})}
      description={t(m.invitedToJoin, {projectName})}
      icon={
        <View style={styles.iconContainer}>
          <InviteIcon
            style={styles.icon}
            fill={LIGHT_GREY}
            width={60}
            height={60}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {borderWidth: 1, borderColor: LIGHT_GREY},
});
