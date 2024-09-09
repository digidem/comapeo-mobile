import * as React from 'react';
import {MapBuffers} from '@mapeo/core/dist/types';
import {InviteInternal, InviteRemovalReason} from '@mapeo/core/dist/invite-api';

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
import {useApi} from '../../contexts/ApiContext';

export type LeaveProjectModalState = 'AlreadyOnProj' | 'LeaveProj';

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

  const [leaveModalState, setLeaveModalState] =
    React.useState<LeaveProjectModalState>('AlreadyOnProj');

  const invite = invites[0];

  const acceptedInvite = useAcceptedInvite();

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
    if (invites.length <= 1) {
      closeInviteSheet();
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
          acceptedInvite?.remove();
        }}>
        {currentInviteCanceled ? (
          <InviteCanceledBottomSheetContent
            handleClose={handleCanceledInvite}
            projectName={invite?.projectName}
          />
        ) : acceptedInvite ? (
          <InviteSuccessBottomSheetContent
            closeSheet={closeInviteSheet}
            projectName={acceptedInvite.value.projectName}
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
      <BottomSheetModal
        onDismiss={() => setLeaveModalState('AlreadyOnProj')}
        fullScreen
        ref={leaveRef}
        isOpen={leaveIsOpen}>
        <LeaveProjectModalContent
          closeSheet={closeLeaveSheet}
          leaveModalState={leaveModalState}
          setToLeaveProject={() => setLeaveModalState('LeaveProj')}
          inviteId={invite?.inviteId || ''}
          accept={accept}
        />
      </BottomSheetModal>
    </>
  );
};

function useAcceptedInvite() {
  const api = useApi();
  const [acceptedInvite, setAcceptedInvite] =
    React.useState<MapBuffers<InviteInternal> | null>(null);

  React.useEffect(() => {
    function onInviteRemoved(
      invite: MapBuffers<InviteInternal>,
      reason: InviteRemovalReason,
    ) {
      if (reason === 'accepted') {
        setAcceptedInvite(invite);
      }
    }

    api.invite.addListener('invite-removed', onInviteRemoved);

    return () => {
      api.invite.removeListener('invite-removed', onInviteRemoved);
    };
  }, [api.invite, setAcceptedInvite]);

  return acceptedInvite
    ? {
        value: acceptedInvite,
        remove: () => {
          setAcceptedInvite(null);
        },
      }
    : null;
}
