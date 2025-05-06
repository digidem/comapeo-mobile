import * as React from 'react';
import {
  AppStackParamsList,
  NativeNavigationComponent,
} from '../../../../../sharedTypes/navigation';
import {defineMessages} from 'react-intl';
import {ReviewInvitation} from './ReviewInvitation';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';
import {useSendInvite, useRequestCancelInvite} from '@comapeo/core-react';
import {useActiveProject} from '../../../../../contexts/ActiveProjectContext';
import * as Sentry from '@sentry/react-native';
import {CommonActions, NavigationProp} from '@react-navigation/native';

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
  const {projectId} = useActiveProject();

  const sendInviteMutation = useSendInvite({projectId});
  const requestCancelInviteMutation = useRequestCancelInvite({projectId});

  function sendInvite() {
    sendInviteMutation.mutate(
      {
        deviceId,
        roleId: role,
      },
      {
        onSuccess: val => {
          // If user has attempted to cancel an invite, but an invite has already been accepted, let user know their cancellation was unsuccessful
          if (
            val === 'ACCEPT' &&
            requestCancelInviteMutation.status === 'pending'
          ) {
            navigation.navigate('InviteDeclined', {
              ...route.params,
              onClose: () => resetToYourTeam(navigation),
            });
            return;
          }
          if (val === 'ACCEPT') {
            navigation.navigate('InviteAccepted', {
              ...route.params,
              onClose: () => resetToYourTeam(navigation),
            });
            return;
          }

          if (val === 'REJECT') {
            navigation.navigate('InviteDeclined', {
              ...route.params,
              onClose: () => resetToYourTeam(navigation),
            });
            return;
          }
        },
        onError(error) {
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }

  function cancelInvite() {
    requestCancelInviteMutation.mutate(
      {deviceId},
      {
        onSuccess: () => {
          resetToYourTeam(navigation);
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  }
  return (
    <>
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
    </>
  );
};

function resetToYourTeam(navigation: NavigationProp<AppStackParamsList>) {
  navigation.dispatch(
    CommonActions.reset({
      index: 2,
      routes: [{name: 'Home'}, {name: 'ProjectSettings'}, {name: 'YourTeam'}],
    }),
  );
}

ReviewAndInvite.navTitle = m.title;
