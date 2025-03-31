import * as React from 'react';
import {NativeNavigationComponent} from '../../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';
import {ErrorBottomSheet} from '../../../../../sharedComponents/ErrorBottomSheet';
import {ReviewInvitation} from './ReviewInvitation';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';
import {useSendInvite, useRequestCancelInvite} from '@comapeo/core-react';
import {useActiveProjectId} from '../../../../../contexts/ActiveProjectIdStoreContext';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.title',
    defaultMessage: 'Review Invitation',
  },
});

export const ReviewAndInvite: NativeNavigationComponent<'ReviewAndInvite'> = ({
  route,
  navigation,
}) => {
  const {role, deviceId, deviceType, name} = route.params;
  const projectId = useActiveProjectId();
  const sendInviteMutation = useSendInvite({projectId: projectId!});
  const requestCancelInviteMutation = useRequestCancelInvite({
    projectId: projectId!,
  });

  function sendInvite() {
    sendInviteMutation.mutate(
      {deviceId, roleId: role},
      {
        onSuccess: val => {
          // If user has attempted to cancel an invite, but an invite has already been accepted, let user know their cancellation was unsuccessful
          if (
            val === 'ACCEPT' &&
            requestCancelInviteMutation.status === 'pending'
          ) {
            navigation.navigate('UnableToCancelInvite', {...route.params});
            return;
          }
          if (val === 'ACCEPT') {
            navigation.navigate('InviteAccepted', route.params);
            return;
          }

          if (val === 'REJECT') {
            navigation.navigate('InviteDeclined', route.params);
            return;
          }
        },
      },
    );
  }

  function cancelInvite() {
    requestCancelInviteMutation.mutate(
      {deviceId},
      {
        onSuccess: () => {
          navigation.popTo('YourTeam');
        },
      },
    );
  }

  function clearError() {
    if (sendInviteMutation.status === 'error') {
      sendInviteMutation.reset();
    }
    if (requestCancelInviteMutation.status === 'error') {
      requestCancelInviteMutation.reset();
    }
  }

  function tryAgain() {
    if (sendInviteMutation.status === 'error') {
      sendInviteMutation.reset();
      sendInvite();
      return;
    }
    if (requestCancelInviteMutation.status === 'error') {
      requestCancelInviteMutation.reset();
      cancelInvite();
    }
  }

  return (
    <React.Fragment>
      {sendInviteMutation.status === 'idle' ? (
        <ReviewInvitation
          sendInvite={sendInvite}
          deviceId={deviceId}
          deviceType={deviceType}
          name={name}
          role={role}
        />
      ) : (
        <WaitingForInviteAccept cancelInvite={cancelInvite} />
      )}
      <ErrorBottomSheet
        error={sendInviteMutation.error || requestCancelInviteMutation.error}
        clearError={clearError}
        tryAgain={tryAgain}
      />
    </React.Fragment>
  );
};

ReviewAndInvite.navTitle = m.title;
