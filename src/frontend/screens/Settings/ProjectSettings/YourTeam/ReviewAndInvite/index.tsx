import * as React from 'react';
import {NativeNavigationComponent} from '../../../../../sharedTypes';
import {defineMessages} from 'react-intl';
import {useBottomSheetModal} from '../../../../../sharedComponents/BottomSheetModal';
import {ErrorModal} from '../../../../../sharedComponents/ErrorModal';
import {ReviewInvitation} from './ReviewInvitation';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';
import {useSendInvite} from '../../../../../hooks/server/invites';

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

  const {openSheet, sheetRef, closeSheet, isOpen} = useBottomSheetModal({
    openOnMount: false,
  });
  const sendInviteMutation = useSendInvite();

  function sendInvite() {
    sendInviteMutation.mutate(
      // @ts-ignore
      {deviceId, role: {roleId: role}},
      {
        onSuccess: val => {
          if (val === 'ACCEPT') {
            navigation.navigate('InviteAccepted', route.params);
            return;
          }

          if (val === 'REJECT') {
            navigation.navigate('InviteDeclined', route.params);
            return;
          }
        },
        onError: () => {
          openSheet();
        },
      },
    );
  }

  return (
    <React.Fragment>
      {sendInviteMutation.isIdle ? (
        <ReviewInvitation
          sendInvite={sendInvite}
          deviceId={deviceId}
          deviceType={deviceType}
          name={name}
          role={role}
        />
      ) : (
        <WaitingForInviteAccept />
      )}
      <ErrorModal
        sheetRef={sheetRef}
        closeSheet={closeSheet}
        isOpen={isOpen}
        clearError={() => navigation.navigate('YourTeam')}
      />
    </React.Fragment>
  );
};

ReviewAndInvite.navTitle = m.title;
