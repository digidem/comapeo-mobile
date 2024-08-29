import * as React from 'react';
import {View} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {rootNavigationRef} from '../../../AppNavigator';
import {SessionInvite} from '../';
import {InviteAccepted} from './InviteAccepted';
import {InviteCanceled} from './InviteCanceled';
import {InviteErrorOccurred} from './InviteErrorOccurred';
import {InvitePending} from './InvitePending';

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
      <InvitePending
        inviteId={inviteId}
        onClose={onDismiss}
        onReject={onReject}
        projectName={projectName}
        startConfirmationFlow={startConfirmationFlow}
      />
    );
  }

  switch (sessionInvite.removalReason) {
    case 'accepted': {
      return (
        <InviteAccepted
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

    case 'canceled': {
      return <InviteCanceled projectName={projectName} onClose={onDismiss} />;
    }

    case 'connection error':
    case 'internal error': {
      return (
        <InviteErrorOccurred projectName={projectName} onClose={onDismiss} />
      );
    }

    // TODO: What to do when reason is "accepted other"?
    case 'accepted other':
    case 'rejected': {
      // Using null can sometimes cause a rendering issue with bottom sheet modal
      return <View style={{height: 100}} />;
    }
  }
}
