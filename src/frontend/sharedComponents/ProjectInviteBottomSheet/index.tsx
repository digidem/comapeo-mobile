import * as React from 'react';
import {Invite, InviteRemovalReason} from '@comapeo/core/dist/invite-api';
import {useClientApi} from '@comapeo/core-react';

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
import {rootNavigationRef} from '../../AppNavigator';
import {EDITING_SCREEN_NAMES} from '../../constants';
import {NavigationContainerRefWithCurrent} from '@react-navigation/native';
import {AppStackParamsList} from '../../sharedTypes/navigation';

export type LeaveProjectModalState = 'AlreadyOnProj' | 'LeaveProj';

export const ProjectInviteBottomSheet = ({
  rootNavigationRef,
}: {
  rootNavigationRef: NavigationContainerRefWithCurrent<AppStackParamsList>;
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

  const [enabledForCurrentScreen, setEnabledForCurrentScreen] = React.useState(
    () => {
      return shouldEnableInviteSheet();
    },
  );

  React.useEffect(() => {
    const unsubscribe = rootNavigationRef.addListener('state', () => {
      setEnabledForCurrentScreen(shouldEnableInviteSheet());
    });

    return () => {
      unsubscribe();
    };
  }, [rootNavigationRef]);

  const [leaveModalState, setLeaveModalState] =
    React.useState<LeaveProjectModalState>('AlreadyOnProj');
  const [inviteModalVisible, setInviteModalVisible] = React.useState(false);

  const invite = invites[0];

  const acceptedInvite = useAcceptedInvite();

  const {currentInviteCanceled, resetCacheAndClearCanceled} =
    useProjectInvitesListener({
      inviteId: invite?.inviteId,
      bottomSheetIsOpen: inviteIsOpen,
    });
  const accept = useAcceptInvite();
  const reject = useRejectInvite();

  React.useEffect(() => {
    if (
      (invite || acceptedInvite) &&
      !inviteModalVisible &&
      enabledForCurrentScreen
    ) {
      setInviteModalVisible(true);
    }
  }, [invite, acceptedInvite, inviteModalVisible, enabledForCurrentScreen]);

  React.useEffect(() => {
    if (inviteModalVisible && !inviteIsOpen) {
      openInviteSheet();
    } else if (!inviteModalVisible && inviteIsOpen) {
      closeInviteSheet();
    }
  }, [inviteModalVisible, inviteIsOpen, openInviteSheet, closeInviteSheet]);

  if (currentInviteCanceled && leaveIsOpen) {
    closeLeaveSheet();
  }

  function handleReject() {
    if (invite) {
      reject.mutate(invite, {
        onSuccess: () => {
          if (invites.length <= 1) {
            setInviteModalVisible(false);
          }
        },
      });
    }
    if (invites.length <= 1) {
      setInviteModalVisible(false);
    }
  }

  function handleCanceledInvite() {
    resetCacheAndClearCanceled();
    if (invites.length <= 1) {
      setInviteModalVisible(false);
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
          setInviteModalVisible(false);
        }}>
        {currentInviteCanceled ? (
          <InviteCanceledBottomSheetContent
            handleClose={handleCanceledInvite}
            projectName={invite?.projectName}
          />
        ) : acceptedInvite ? (
          <InviteSuccessBottomSheetContent
            closeSheet={() => {
              setInviteModalVisible(false);
            }}
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
  const api = useClientApi();
  const [acceptedInvite, setAcceptedInvite] = React.useState<Invite | null>(
    null,
  );

  React.useEffect(() => {
    function onInviteRemoved(invite: Invite, reason: InviteRemovalReason) {
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

function shouldEnableInviteSheet() {
  const currentRoute = rootNavigationRef?.current?.getCurrentRoute();

  if (!currentRoute) return true;

  for (const name of EDITING_SCREEN_NAMES) {
    if (name === currentRoute.name) return false;
  }

  return true;
}
