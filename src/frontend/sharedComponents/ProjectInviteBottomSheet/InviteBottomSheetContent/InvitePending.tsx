import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {useAcceptInvite, useRejectInvite} from '../../../hooks/server/invites';
import {useAllProjects} from '../../../hooks/server/projects';
import InviteIcon from '../../../images/AddPersonCircle.svg';
import {LIGHT_GREY} from '../../../lib/styles';
import {BottomSheetModalContent} from '../../BottomSheetModal';
import {InviteErrorOccurred} from './InviteErrorOccurred';

const m = defineMessages({
  declineInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.PendingInvite.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  acceptInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.PendingInvite.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  joinProject: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.PendingInvite.joinProject',
    defaultMessage: 'Join {projectName}',
  },
  invitedToJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.InviteBottomSheetContent.PendingInvite.invitedToJoin',
    defaultMessage: "You've been invited to join <bold>{projectName}</bold>",
  },
});

export function InvitePending({
  inviteId,
  onClose,
  onReject,
  projectName,
  startConfirmationFlow,
}: {
  inviteId: string;
  onClose: () => void;
  onReject: () => void;
  projectName: string;
  startConfirmationFlow: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const [error, setError] = React.useState<Error | null>(null);

  const allProjectsQuery = useAllProjects();

  const accept = useAcceptInvite();
  const reject = useRejectInvite();

  const isLoading =
    allProjectsQuery.status === 'pending' ||
    accept.isPending ||
    reject.isPending;

  return error ? (
    <InviteErrorOccurred projectName={projectName} onClose={onClose} />
  ) : (
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
            // TODO: Do proper check that we are not on initial project
            if (allProjectsQuery.data && allProjectsQuery.data.length > 1) {
              startConfirmationFlow();
              return;
            }

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
