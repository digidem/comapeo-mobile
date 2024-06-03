import * as React from 'react';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {useNavigationState} from '@react-navigation/native';
import {isEditingScreen} from '../../lib/utils';
import {
  useAcceptInvite,
  usePendingInvites,
  useRejectInvite,
} from '../../hooks/server/invites';
import {useProjectInvitesListener} from '../../hooks/useProjectInvitesListener';
import {NewInviteBottomSheetContent} from './NewInviteBottomSheetContent';
import {InviteSuccessBottomSheetContent} from './InviteSuccessBottomSheetContent';
import {InviteCanceledBottomSheetContent} from './InviteCanceledBottomSheetContent';

export const ProjectInviteBottomSheet = () => {
  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const routes = useNavigationState(state => (!state ? [] : state.routes));
  const index = useNavigationState(state => (!state ? undefined : state.index));

  const isEditScreen = isEditingScreen(routes, index);
  const invites = usePendingInvites().data.sort(
    (a, b) => a.receivedAt - b.receivedAt,
  );
  const invite = invites[0];
  const {currentInviteCanceled, resetCacheAndClearCanceled} =
    useProjectInvitesListener({
      inviteId: invite?.inviteId,
      bottomSheetIsOpen: isOpen,
    });
  const accept = useAcceptInvite(invite?.projectPublicId);
  const reject = useRejectInvite();

  if (invite && !isOpen && !isEditScreen) {
    openSheet();
  }

  function handleReject() {
    if (invite) {
      reject.mutate(invite, {
        onSuccess: () => {
          if (invites.length <= 1) {
            closeSheet();
          }
        },
      });
    }
  }

  function handleCanceledInvite() {
    resetCacheAndClearCanceled();
    if (invites.length <= 1) {
      closeSheet();
    }
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={() => {
        accept.reset();
        reject.reset();
      }}>
      {currentInviteCanceled ? (
        <InviteCanceledBottomSheetContent
          handleClose={handleCanceledInvite}
          projectName={invite?.projectName}
        />
      ) : !accept.isSuccess ? (
        <NewInviteBottomSheetContent
          handleAccept={() => {
            if (invite) accept.mutate(invite);
          }}
          isLoading={accept.isPending || reject.isPending}
          handleReject={handleReject}
          projectName={invite?.projectName}
        />
      ) : (
        <InviteSuccessBottomSheetContent
          closeSheet={closeSheet}
          projectName={invite?.projectName}
        />
      )}
    </BottomSheetModal>
  );
};
