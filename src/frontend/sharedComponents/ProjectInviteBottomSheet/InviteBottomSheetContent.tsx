import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

import {rootNavigationRef} from '../../AppNavigator';
import {SessionInvite} from '../../contexts/SessionInvitesContext';
import {InviteAcceptedContent} from './InviteAcceptedContent';
import {InviteCanceledContent} from './InviteCanceledContent';
import {InvitePendingContent} from './InvitePendingContent';

export function InviteBottomSheetContent({
  onAccept,
  onDismiss,
  onReject,
  sessionInvite,
  startConfirmationFlow,
}: {
  onReject: () => void;
  onDismiss: () => void;
  onAccept: () => void;
  sessionInvite: SessionInvite;
  startConfirmationFlow: () => void;
}) {
  const {projectName, inviteId} = sessionInvite.invite;

  if (sessionInvite.status === 'pending') {
    return (
      <InvitePendingContent
        inviteId={inviteId}
        projectName={projectName}
        onReject={onReject}
        startConfirmationFlow={startConfirmationFlow}
      />
    );
  }

  if (sessionInvite.removalReason === 'accepted') {
    return (
      <InviteAcceptedContent
        projectName={projectName}
        onGoToMap={() => {
          if (rootNavigationRef.isReady()) {
            onAccept();
            rootNavigationRef.navigate('Home', {screen: 'Map'});
          }
        }}
        onGoToSync={() => {
          if (rootNavigationRef.isReady()) {
            onAccept();
            rootNavigationRef.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'Home'}, {name: 'Sync'}],
              }),
            );
          }
        }}
      />
    );
  }

  if (sessionInvite.removalReason === 'canceled') {
    return (
      <InviteCanceledContent projectName={projectName} onClose={onDismiss} />
    );
  }

  return null;
}
