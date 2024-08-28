import * as React from 'react';
import {View} from 'react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

import {useSessionInvites} from '../../contexts/SessionInvitesContext';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {LeaveProjectModalContent} from '../LeaveProjectModalContent';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';

export const ProjectInviteBottomSheet = ({
  enabledForCurrentScreen,
}: {
  enabledForCurrentScreen: boolean;
}) => {
  const inviteBottomSheet = useBottomSheetModal({
    openOnMount: false,
  });

  const leaveProjectSheet = useBottomSheetModal({
    openOnMount: false,
  });

  const sessionInvites = useSessionInvites();

  const [displayedInviteId, setDisplayedInviteId] = React.useState(
    () =>
      sessionInvites.find(({status}) => status === 'pending')?.invite.inviteId,
  );

  if (!displayedInviteId) {
    const nextPending = sessionInvites.find(({status}) => status === 'pending');
    if (nextPending) {
      setDisplayedInviteId(nextPending.invite.inviteId);
    }
  }

  const displayedInvite = React.useMemo(() => {
    return displayedInviteId
      ? sessionInvites.find(
          s =>
            s.invite.inviteId === displayedInviteId &&
            // There's a race condition where after rejecting an invite, `sessionInvites` will update
            // to reflect that before we unset `displayedInviteId` in `seeNextInviteOrClose()`.
            // Without this check, `displayedInvite` is set to the rejected invite, which is currently not supported in the UI.
            !(s.status === 'removed' && s.removalReason === 'rejected'),
        )
      : undefined;
  }, [displayedInviteId, sessionInvites]);

  const seeNextInviteOrClose = () => {
    const nextPendingInvite = sessionInvites
      .filter(i => i.invite.inviteId !== displayedInviteId)
      .find(i => i.status === 'pending');

    if (nextPendingInvite) {
      setDisplayedInviteId(nextPendingInvite.invite.inviteId);
    } else {
      setDisplayedInviteId(undefined);
      inviteBottomSheet.closeSheet();
    }
  };

  // Open the invite sheet if there's a displayable invite and the sheet isn't already open
  React.useEffect(() => {
    // TODO: Race condition where after rejecting an invite,
    // this will sometimes call `openSheet()` with a stale `displayedInvite`,
    // causing subsequent incoming pending invites to not automatically open the sheet
    if (
      displayedInvite &&
      !inviteBottomSheet.isOpen &&
      enabledForCurrentScreen
    ) {
      inviteBottomSheet.openSheet();
    }
  }, [displayedInvite, inviteBottomSheet, enabledForCurrentScreen]);

  return (
    <>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={inviteBottomSheet.sheetRef}
          isOpen={inviteBottomSheet.isOpen}>
          {displayedInvite ? (
            <InviteBottomSheetContent
              sessionInvite={displayedInvite}
              startConfirmationFlow={() => {
                inviteBottomSheet.closeSheet();
                leaveProjectSheet.openSheet();
              }}
              onAccept={() => {
                setDisplayedInviteId(undefined);
                inviteBottomSheet.closeSheet();
              }}
              onDismiss={seeNextInviteOrClose}
              onReject={seeNextInviteOrClose}
            />
          ) : (
            // Using null can sometimes cause a rendering issue with bottom sheet modal
            <View style={{height: 100}} />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>

      <BottomSheetModalProvider>
        <BottomSheetModal
          fullScreen
          ref={leaveProjectSheet.sheetRef}
          isOpen={leaveProjectSheet.isOpen}>
          {displayedInvite ? (
            <LeaveProjectModalContent
              onCancel={() => {
                leaveProjectSheet.closeSheet();
                inviteBottomSheet.openSheet();
              }}
              onSuccess={() => {
                leaveProjectSheet.closeSheet();
                inviteBottomSheet.openSheet();
              }}
              inviteId={displayedInvite.invite.inviteId}
              projectName={displayedInvite.invite.projectName}
            />
          ) : (
            // Using null can sometimes cause a rendering issue with bottom sheet modal
            <View style={{height: 100}} />
          )}
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
};
