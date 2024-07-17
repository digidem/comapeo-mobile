import * as React from 'react';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {
  useAcceptInvite,
  usePendingInvites,
  useRejectInvite,
} from '../../hooks/server/invites';
import {useProjectInvitesListener} from '../../hooks/useProjectInvitesListener';
import {NewInviteBottomSheetContent} from './NewInviteBottomSheetContent';
import {InviteSuccessBottomSheetContent} from './InviteSuccessBottomSheetContent';
import {InviteCanceledBottomSheetContent} from './InviteCanceledBottomSheetContent';
import {useAllProjects} from '../../hooks/server/projects';
import {LeaveProjectModalContent} from '../LeaveProjectModalContent';

export const ProjectInviteBottomSheet = ({
  enabledForCurrentScreen,
}: {
  enabledForCurrentScreen: boolean;
}) => {
  const {
    sheetRef: inviteRef,
    isOpen: inviteIsOpen,
    closeSheet: closeInviteSheet,
    openSheet: openInviteSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });

  const {
    sheetRef: leaveRef,
    isOpen: leaveIsOpen,
    closeSheet: closeLeaveSheet,
    openSheet: openLeaveSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });
  const invites = usePendingInvites().data.sort(
    (a, b) => a.receivedAt - b.receivedAt,
  );

  const projects = useAllProjects();

  const invite = invites[0];

  const {currentInviteCanceled, resetCacheAndClearCanceled} =
    useProjectInvitesListener({
      inviteId: invite?.inviteId,
      bottomSheetIsOpen: inviteIsOpen,
    });
  const accept = useAcceptInvite();
  const reject = useRejectInvite();

  if (invite && !inviteIsOpen && enabledForCurrentScreen) {
    openInviteSheet();
  }

  if (currentInviteCanceled && leaveIsOpen) {
    closeLeaveSheet();
  }

  function handleReject() {
    if (invite) {
      reject.mutate(invite, {
        onSuccess: () => {
          if (invites.length <= 1) {
            closeInviteSheet();
          }
        },
      });
    }
  }

  function handleCanceledInvite() {
    resetCacheAndClearCanceled();
    if (invites.length <= 1) {
      closeInviteSheet();
    }
  }

  function handleAccept() {
    if (invite) {
      // the accept button will be in a loading state until projects.data is available. So user will not be able to get here until the projects have loaded
      if (projects.data && projects.data.length > 1) {
        openLeaveSheet();
        return;
      }

      accept.mutate({inviteId: invite.inviteId});
    }
  }

  return (
    <>
      <BottomSheetModal
        ref={inviteRef}
        isOpen={inviteIsOpen}
        onDismiss={() => {
          accept.reset();
          reject.reset();
        }}>
        {currentInviteCanceled ? (
          <InviteCanceledBottomSheetContent
            handleClose={handleCanceledInvite}
            projectName={invite?.projectName}
          />
        ) : accept.isSuccess ? (
          <InviteSuccessBottomSheetContent
            closeSheet={closeInviteSheet}
            projectName={invite?.projectName}
          />
        ) : (
          <NewInviteBottomSheetContent
            handleAccept={handleAccept}
            isLoading={
              accept.isPending || reject.isPending || projects.isPending
            }
            handleReject={handleReject}
            projectName={invite?.projectName}
          />
        )}
      </BottomSheetModal>
      <BottomSheetModal fullScreen ref={leaveRef} isOpen={leaveIsOpen}>
        <LeaveProjectModalContent
          cancel={closeLeaveSheet}
          inviteId={invite?.inviteId || ''}
          accept={accept}
        />
      </BottomSheetModal>
    </>
  );
};
