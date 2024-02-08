import * as React from 'react';
import {NativeNavigationComponent} from '../../../../../sharedTypes';
import {defineMessages} from 'react-intl';
import {useBottomSheetModal} from '../../../../../sharedComponents/BottomSheetModal';
import {useQueryClient} from '@tanstack/react-query';
import {useProject} from '../../../../../hooks/server/projects';
import {ErrorModal} from '../../../../../sharedComponents/ErrorModal';
import {ReviewInvitation} from './ReviewInvitation';
import {WaitingForInviteAccept} from './WaitingForInviteAccept';

const m = defineMessages({
  title: {
    id: 'screens.Setting.ProjectSettings.YourTeam.ReviewAndInvite.title',
    defaultMessage: 'Review Invitation',
  },
});

export const ReviewAndInvite: NativeNavigationComponent<'ReviewAndInvite'> = ({
  route,
  navigation,
}) => {
  const [inviteStatus, setInviteStatus] = React.useState<
    'reviewing' | 'waiting'
  >('reviewing');
  const {role, deviceId, deviceType, name} = route.params;

  const {openSheet, sheetRef, closeSheet, isOpen} = useBottomSheetModal({
    openOnMount: false,
  });
  const project = useProject();
  const queryClient = useQueryClient();

  function sendInvite() {
    setInviteStatus('waiting');
    project.$member
      .invite(deviceId, {roleId: role})
      .then(val => {
        if (val == 'ACCEPT') {
          queryClient.invalidateQueries({queryKey: ['projectMembers']});
          navigation.navigate('InviteAccepted', {...route.params});
          return;
        }
      })
      .catch(err => {
        openSheet();
      });
  }

  return (
    <React.Fragment>
      {inviteStatus === 'reviewing' ? (
        <ReviewInvitation
          sendInvite={sendInvite}
          deviceId={deviceId}
          deviceType={deviceType}
          name={name}
          role={role}
        />
      ) : (
        <WaitingForInviteAccept />
      )}
      <ErrorModal
        sheetRef={sheetRef}
        closeSheet={closeSheet}
        isOpen={isOpen}
        clearError={() => navigation.navigate('YourTeam')}
      />
    </React.Fragment>
  );
};

ReviewAndInvite.navTitle = m.title;
