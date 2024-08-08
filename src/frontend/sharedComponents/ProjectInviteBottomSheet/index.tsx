import * as React from 'react';
import {View} from 'react-native';

import {useSessionInvites} from '../../contexts/SessionInvitesContext';
import {BottomSheetModal, useBottomSheetModal} from '../BottomSheetModal';
import {InviteBottomSheetContent} from './InviteBottomSheetContent';

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

  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
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
    if (showableInvite && !isOpen && enabledForCurrentScreen) {
      openSheet();
    }
  }, [showableInvite, isOpen, enabledForCurrentScreen, openSheet]);

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
      {showableInvite ? (
        <InviteBottomSheetContent
          sessionInvite={showableInvite}
          onAfterResponse={type => {
            switch (type) {
              case 'dismiss':
              case 'accept': {
                setCurrentInviteId(undefined);
                closeSheet();
                break;
              }
              case 'reject': {
                const otherPendingInvites = sessionInvites
                  .filter(i => i.invite.inviteId !== currentInviteId)
                  .find(i => i.status === 'pending');

                if (!otherPendingInvites) {
                  setCurrentInviteId(undefined);
                  closeSheet();
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
      ) : (
        <View style={{height: 100}} />
      )}
    </BottomSheetModal>
  );
};
