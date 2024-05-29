import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

import {rootNavigationRef} from '../../AppNavigator';
import {SessionInvite} from '../../contexts/SessionInvitesContext';
import {InviteAcceptedContent} from './InviteAcceptedContent';
import {InviteCancelledContent} from './InviteCancelledContent';
import {InvitePendingContent} from './InvitePendingContent';

export function InviteBottomSheetContent({
  sessionInvite,
  totalSessionInvites,
  onClose,
}: {
  sessionInvite: SessionInvite;
  totalSessionInvites: number;
  onClose: () => void;
}) {
  const {projectName, projectPublicId, inviteId} = sessionInvite.invite;

  if (sessionInvite.status === 'pending') {
    return (
      <InvitePendingContent
        inviteId={inviteId}
        projectName={projectName}
        projectPublicId={projectPublicId}
        onReject={() => {
          // TODO: Set invite id to next pending?
          if (totalSessionInvites === 1) {
            onClose();
          }
        }}
      />
    );
  }

  return sessionInvite.removalReason === 'accepted' ? (
    <InviteAcceptedContent
      projectName={projectName}
      onGoToMap={() => {
        if (rootNavigationRef.isReady()) {
          rootNavigationRef.navigate('Home', {screen: 'Map'});
          onClose();
        }
      }}
      onGoToSync={() => {
        if (rootNavigationRef.isReady()) {
          rootNavigationRef.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Home'}, {name: 'Sync'}],
            }),
          );
          onClose();
        }
      }}
    />
  ) : (
    <InviteCancelledContent projectName={projectName} onClose={onClose} />
  );
}
