import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

import {rootNavigationRef} from '../../AppNavigator';
import {SessionInvite} from '../../contexts/SessionInvitesContext';
import {usePersistedProjectId} from '../../hooks/persistedState/usePersistedProjectId';
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

  const switchActiveProject = usePersistedProjectId(
    state => state.setProjectId,
  );

  if (sessionInvite.status === 'pending') {
    return (
      <InvitePendingContent
        inviteId={inviteId}
        projectName={projectName}
        onReject={() => {
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
          switchActiveProject(projectPublicId);
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
          switchActiveProject(projectPublicId);
        }
      }}
    />
  ) : (
    <InviteCancelledContent projectName={projectName} onClose={onClose} />
  );
}
