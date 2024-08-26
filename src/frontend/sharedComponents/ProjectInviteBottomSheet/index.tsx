import * as React from 'react';
import {View} from 'react-native';

import {useSessionInvites} from '../../contexts/SessionInvitesContext';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';
import {LeaveProjectModalContent} from '../LeaveProjectModalContent';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

export const ProjectInviteBottomSheet = ({
  enabledForCurrentScreen,
}: {
  enabledForCurrentScreen: boolean;
}) => {
  const sessionInvites = useSessionInvites();

  const [currentInviteId, setCurrentInviteId] = React.useState(
    () =>
      sessionInvites.find(({status}) => status === 'pending')?.invite.inviteId,
  );

  const inviteBottomSheet = useBottomSheetModal({
    openOnMount: false,
  });

  const leaveProjectSheet = useBottomSheetModal({
    openOnMount: false,
  });

  if (!currentInviteId) {
    const nextPending = sessionInvites.find(({status}) => status === 'pending');
    if (nextPending) {
      setCurrentInviteId(nextPending.invite.inviteId);
    }
  }

  const showableInvite = currentInviteId
    ? sessionInvites.find(
        ({invite: {inviteId}}) => inviteId === currentInviteId,
      )
    : undefined;

  React.useEffect(() => {
    if (
      showableInvite &&
      !inviteBottomSheet.isOpen &&
      enabledForCurrentScreen
    ) {
      inviteBottomSheet.openSheet();
    }
  }, [showableInvite, inviteBottomSheet, enabledForCurrentScreen]);

  return (
    <>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={inviteBottomSheet.sheetRef}
          isOpen={inviteBottomSheet.isOpen}>
          {showableInvite ? (
            <InviteBottomSheetContent
              sessionInvite={showableInvite}
              startConfirmationFlow={() => {
                inviteBottomSheet.closeSheet();
                leaveProjectSheet.openSheet();
              }}
              onAccept={() => {
                setCurrentInviteId(undefined);
                inviteBottomSheet.closeSheet();
              }}
              onDismiss={() => {
                setCurrentInviteId(undefined);
                inviteBottomSheet.closeSheet();
              }}
              onReject={() => {
                setCurrentInviteId(undefined);

                const otherPendingInvites = sessionInvites
                  .filter(i => i.invite.inviteId !== currentInviteId)
                  .find(i => i.status === 'pending');

                if (!otherPendingInvites) {
                  inviteBottomSheet.closeSheet();
                }
              }}
            />
          ) : (
            <View style={{height: 100}} />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          fullScreen
          ref={leaveProjectSheet.sheetRef}
          isOpen={leaveProjectSheet.isOpen}>
          {showableInvite ? (
            <LeaveProjectModalContent
              onCancel={() => {
                leaveProjectSheet.closeSheet();
                inviteBottomSheet.openSheet();
              }}
              onSuccess={() => {
                leaveProjectSheet.closeSheet();
              }}
              inviteId={showableInvite.invite.inviteId}
              projectName={showableInvite.invite.projectName}
            />
          ) : (
            <View style={{height: 100}} />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};
