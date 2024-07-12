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
import {AlreadyOnProject} from '../LeaveProjectModalContent/AlreadyOnProject';
import {LeaveProject} from '../LeaveProjectModalContent/LeaveProject';
import {useAllProjects} from '../../hooks/server/projects';

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
    closeSheet: closeleaveSheet,
    openSheet: openleaveSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });
  const invites = usePendingInvites().data.sort(
    (a, b) => a.receivedAt - b.receivedAt,
  );

  const projects = useAllProjects();
  const [leaveModalState, setLeaveModalState] = React.useState<
    'AlreadyOnProj' | 'LeaveProj'
  >('AlreadyOnProj');
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

  function resetLeaveModalState() {
    setLeaveModalState('AlreadyOnProj');
  }

  function closeAndResetLeaveModal() {
    closeleaveSheet();
    resetLeaveModalState();
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

  return (
    <BottomSheetModal
      ref={inviteRef}
      isOpen={inviteIsOpen}
      onDismiss={() => {
        accept.reset();
        reject.reset();
        resetLeaveModalState();
      }}>
      <>
        {currentInviteCanceled ? (
          <InviteCanceledBottomSheetContent
            handleClose={handleCanceledInvite}
            projectName={invite?.projectName}
          />
        ) : !accept.isSuccess ? (
          <NewInviteBottomSheetContent
            handleAccept={() => {
              if (invite) {
                if (projects.data && projects.data.length > 1) {
                  openleaveSheet();
                  return;
                }
                accept.mutate(invite);
              }
            }}
            isLoading={
              accept.isPending || reject.isPending || projects.isPending
            }
            handleReject={handleReject}
            projectName={invite?.projectName}
          />
        ) : (
          <InviteSuccessBottomSheetContent
            closeSheet={closeInviteSheet}
            projectName={invite?.projectName}
          />
        )}
        <BottomSheetModal
          isOpen={leaveIsOpen}
          ref={leaveRef}
          fullScreen
          onDismiss={resetLeaveModalState}>
          {leaveModalState === 'AlreadyOnProj' ? (
            <AlreadyOnProject
              moveToLeaveProjectModalContent={() => {
                setLeaveModalState('LeaveProj');
              }}
              closeSheet={closeAndResetLeaveModal}
            />
          ) : (
            <LeaveProject
              closeSheet={closeAndResetLeaveModal}
              inviteId={invite?.inviteId || ''}
              accept={accept}
            />
          )}
        </BottomSheetModal>
      </>
    </BottomSheetModal>
  );
};
