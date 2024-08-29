import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {View} from 'react-native';
import {InviteInternal, InviteRemovalReason} from '@mapeo/core/dist/invite-api';
import {MapBuffers} from '@mapeo/core/dist/types';

import {useApi} from '../../contexts/ApiContext';
import {usePendingInvites} from '../../hooks/server/invites';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {LeaveProjectModalContent} from '../LeaveProjectModalContent';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';

export type SessionInvite =
  | {
      status: 'pending';
      invite: MapBuffers<InviteInternal>;
    }
  | {
      status: 'removed';
      invite: MapBuffers<InviteInternal>;
      removalReason: InviteRemovalReason;
    };

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

  // Ideally not needed but this is used for handling a state coordination complexity between the queried
  // In the case of rejecting an invite, there's a moment in time where the pending invites query properly removes the rejected invite
  // but the data from useRemovedInvites() does not yet have the corresponding data.
  // Without this, the displayedInviteId will again be set to this rejected invite which is not desirable, as it will cause the invite bottom sheet
  // to open again unintentionally and run into an (ideally) impossible state, resulting in subsequent invites not opening the sheet as expected.
  const lastRejectedInviteIdRef = React.useRef<string | undefined>();

  const sessionInvites = useSessionInvites();

  const [displayedInviteId, setDisplayedInviteId] = React.useState(
    () => sessionInvites.pending[0]?.invite.inviteId,
  );

  React.useEffect(() => {
    if (!displayedInviteId) {
      const nextPending = sessionInvites.pending.find(
        ({invite}) => invite.inviteId !== lastRejectedInviteIdRef.current,
      );

      if (nextPending) {
        setDisplayedInviteId(nextPending.invite.inviteId);
      }
    }
  }, [displayedInviteId, setDisplayedInviteId, sessionInvites]);

  const displayedInvite: SessionInvite | undefined = React.useMemo(() => {
    const removed = displayedInviteId
      ? sessionInvites.removed.find(
          s =>
            s.invite.inviteId === displayedInviteId && s.reason !== 'rejected',
        )
      : undefined;

    if (removed) {
      return {
        status: 'removed' as const,
        removalReason: removed.reason,
        invite: removed.invite,
      };
    }

    return displayedInviteId
      ? sessionInvites.pending.find(
          s => s.invite.inviteId === displayedInviteId,
        )
      : undefined;
  }, [displayedInviteId, sessionInvites]);

  const seeNextInviteOrClose = () => {
    sessionInvites.clearRemoved();

    const nextPendingInvite = sessionInvites.pending.filter(
      i => i.invite.inviteId !== displayedInviteId,
    )[0];

    if (nextPendingInvite) {
      setDisplayedInviteId(nextPendingInvite.invite.inviteId);
    } else {
      setDisplayedInviteId(undefined);
      inviteBottomSheet.closeSheet();
    }
  };

  // Open the invite sheet if there's a displayable invite and the sheet isn't already open
  React.useEffect(() => {
    if (
      displayedInvite &&
      !inviteBottomSheet.isOpen &&
      enabledForCurrentScreen
    ) {
      inviteBottomSheet.openSheet();
    }
  }, [displayedInvite, inviteBottomSheet, enabledForCurrentScreen]);

  // If leave project sheet is open (but not yet actually initiated) and the displayed invite becomes cancelled,
  // close the leave project sheet and open the invite sheet to display the cancelled state
  React.useEffect(() => {
    if (
      displayedInvite?.status === 'removed' &&
      displayedInvite.removalReason === 'canceled' &&
      leaveProjectSheet.isOpen
    ) {
      leaveProjectSheet.closeSheet();
      inviteBottomSheet.openSheet();
    }
  }, [displayedInvite, leaveProjectSheet, inviteBottomSheet]);

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
              onReject={() => {
                lastRejectedInviteIdRef.current =
                  displayedInvite.invite.inviteId;
                seeNextInviteOrClose();
              }}
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

function useSessionInvites() {
  const pendingInvitesQuery = usePendingInvites();

  const removedInvites = useRemovedInvites();
  const pending = (pendingInvitesQuery.data || [])
    // Potentially accounts for stale data resulting in an invite being in both pending and removed sources for a short period of time?
    .filter(
      invite =>
        !removedInvites.data.find(
          removedInvite => removedInvite.invite.inviteId === invite.inviteId,
        ),
    )
    .map(invite => ({
      status: 'pending' as const,
      invite,
    }));

  return {
    pending,
    removed: removedInvites.data,
    clearRemoved: removedInvites.clear,
  };
}

function useRemovedInvites() {
  const mapeoApi = useApi();

  const [removedInvites, setRemovedInvites] = React.useState<
    Array<{invite: MapBuffers<InviteInternal>; reason: InviteRemovalReason}>
  >([]);

  React.useEffect(() => {
    function onInviteRemoved(
      invite: MapBuffers<InviteInternal>,
      reason: InviteRemovalReason,
    ) {
      setRemovedInvites(prev => [...prev, {invite, reason}]);
    }

    mapeoApi.invite.addListener('invite-removed', onInviteRemoved);

    return () => {
      mapeoApi.invite.removeListener('invite-removed', onInviteRemoved);
    };
  }, [mapeoApi, setRemovedInvites]);

  return {
    data: removedInvites,
    clear: () => {
      setRemovedInvites([]);
    },
  };
}
