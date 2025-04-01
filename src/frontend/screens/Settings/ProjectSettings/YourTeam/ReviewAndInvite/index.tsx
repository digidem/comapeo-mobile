import * as React from 'react';
import {NativeNavigationComponent} from '../../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';
import {ReviewInvitation} from './ReviewInvitation';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';
import {
  useRequestCancelInvite,
  useSendInvite,
} from '../../../../../hooks/server/invites';
import * as Sentry from '@sentry/react-native';

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

  const sendInviteMutation = useSendInvite();
  const requestCancelInviteMutation = useRequestCancelInvite();

  function sendInvite() {
    sendInviteMutation.mutate(
      {deviceId, role: {roleId: role}},
      {
        onSuccess: val => {
          // If user has attempted to cancel an invite, but an invite has already been accepted, let user know their cancellation was unsuccessful
          if (val === 'ACCEPT' && requestCancelInviteMutation.isPending) {
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
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }

  function cancelInvite() {
    requestCancelInviteMutation.mutate(deviceId, {
      onSuccess: () => {
        navigation.popTo('YourTeam');
      },
      onError: err => {
        Sentry.captureException(err);
        navigation.navigate('ErrorBottomSheet');
      },
    });
  }

  return (
    <>
      {sendInviteMutation.isIdle ? (
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
    </>
  );
};

ReviewAndInvite.navTitle = m.title;
