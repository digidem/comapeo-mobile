import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

import {rootNavigationRef} from '../../AppNavigator';
import {SessionInvite} from '../../contexts/SessionInvitesContext';
import {InviteAcceptedContent} from './InviteAcceptedContent';
import {InviteCanceledContent} from './InviteCanceledContent';
import {InvitePendingContent} from './InvitePendingContent';
import {View} from 'react-native';

export function InviteBottomSheetContent({
  sessionInvite,
  onAfterResponse,
}: {
  sessionInvite: SessionInvite;
  onAfterResponse: (response: 'accept' | 'reject' | 'dismiss') => void;
}) {
  const {projectName, inviteId} = sessionInvite.invite;

  if (sessionInvite.status === 'pending') {
    return (
      <InvitePendingContent
        inviteId={inviteId}
        projectName={projectName}
        onReject={() => {
          onAfterResponse('reject');
        }}
      />
    );
  }

  if (sessionInvite.removalReason === 'accepted') {
    return (
      <InviteAcceptedContent
        projectName={projectName}
        onGoToMap={() => {
          if (rootNavigationRef.isReady()) {
            onAfterResponse('accept');
            rootNavigationRef.navigate('Home', {screen: 'Map'});
          }
        }}
        onGoToSync={() => {
          if (rootNavigationRef.isReady()) {
            onAfterResponse('accept');
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
      <InviteCanceledContent
        projectName={projectName}
        onClose={() => {
          onAfterResponse('dismiss');
        }}
      />
    );
  }

  // TODO: Needed to render a non-null child here to prevent a weird bottom sheet bug in the case of declining the invite
  return <View style={{height: 100}} />;
}
