import * as React from 'react';
import {View} from 'react-native';

import {useSessionInvites} from '../../contexts/SessionInvitesContext';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';
import {LeaveProjectModalContent} from '../LeaveProjectModalContent';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useDeviceName} from 'react-native-device-info';

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

  const {isOpen, openSheet} = inviteBottomSheet;

  const device = useDeviceName();

  React.useEffect(() => {
    if (showableInvite && !isOpen && enabledForCurrentScreen) {
      console.log('OPENING');
      openSheet();
    }
  }, [showableInvite, isOpen, openSheet, enabledForCurrentScreen]);

  console.log({
    device,
    showableInvite,
    isOpen,
  });
  return (
    <>
      {showableInvite && (
        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={inviteBottomSheet.sheetRef}
            isOpen={inviteBottomSheet.isOpen}
            onDismiss={() => {}}>
            <InviteBottomSheetContent
              sessionInvite={showableInvite}
              startConfirmationFlow={() => {
                inviteBottomSheet.closeSheet();
                leaveProjectSheet.openSheet();
              }}
              onAfterResponse={type => {
                switch (type) {
                  case 'dismiss':
                  case 'accept': {
                    setCurrentInviteId(undefined);
                    inviteBottomSheet.closeSheet();
                    break;
                  }
                  case 'reject': {
                    const otherPendingInvites = sessionInvites
                      .filter(i => i.invite.inviteId !== currentInviteId)
                      .find(i => i.status === 'pending');

                    if (!otherPendingInvites) {
                      setCurrentInviteId(undefined);
                      inviteBottomSheet.closeSheet();
                      return;
                    }

                    setCurrentInviteId(undefined);
                    break;
                  }
                  default: {
                    console.error(`Unknown response type ${type}`);
                  }
                }
              }}
            />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      )}

      {showableInvite && (
        <BottomSheetModalProvider>
          <BottomSheetModal
            fullScreen
            ref={leaveProjectSheet.sheetRef}
            isOpen={leaveProjectSheet.isOpen}>
            <LeaveProjectModalContent
              onClose={() => {
                leaveProjectSheet.closeSheet();
              }}
              inviteId={showableInvite.invite.inviteId}
              projectName={showableInvite.invite.projectName}
            />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      )}
    </>
  );
};
