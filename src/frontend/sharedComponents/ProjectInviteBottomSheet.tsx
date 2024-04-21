import {
  BottomSheetContent,
  BottomSheetModal,
  useBottomSheetModal,
} from './BottomSheetModal';
import InviteIcon from '../images/AddPersonCircle.svg';
import GreenCheck from '../images/GreenCheck.svg';
import {defineMessages, useIntl} from 'react-intl';
import {LIGHT_GREY} from '../lib/styles';
import {View} from 'react-native';
import {useProjectInvite} from '../hooks/useProjectInvite';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {CommonActions, useNavigationState} from '@react-navigation/native';
import {isEditingScreen} from '../lib/utils';

const m = defineMessages({
  declineInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  acceptInvite: {
    id: 'sharedComponents.ProjectInviteBottomSheet.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  joinProject: {
    id: 'sharedComponents.ProjectInviteBottomSheet.joinProject',
    defaultMessage: 'Join Project {projName}',
  },
  invitedToJoin: {
    id: 'sharedComponents.ProjectInviteBottomSheet.invitedToJoin',
    defaultMessage: "You've been invited to join {projName}",
  },
  goToMap: {
    id: 'sharedComponents.ProjectInviteBottomSheet.goToMap',
    defaultMessage: 'Go To Map',
  },
  success: {
    id: 'sharedComponents.ProjectInviteBottomSheet.success',
    defaultMessage: 'Success',
  },
  youHaveJoined: {
    id: 'sharedComponents.ProjectInviteBottomSheet.youHaveJoined',
    defaultMessage: 'You have joined {projName}',
  },
  goToSync: {
    id: 'sharedComponents.ProjectInviteBottomSheet.goToSync',
    defaultMessage: 'Go To Sync',
  },
});

export const ProjectInviteBottomSheet = () => {
  const {formatMessage} = useIntl();
  const {sheetRef, isOpen, closeSheet, openSheet} = useBottomSheetModal({
    openOnMount: false,
  });
  const {accept, invite, reject, resetState, numberOfInvites, clearAllInvites} =
    useProjectInvite();
  const navigation = useNavigationFromRoot();
  const routes = useNavigationState(state => (!state ? [] : state.routes));
  const index = useNavigationState(state => (!state ? undefined : state.index));

  const isEditScreen = isEditingScreen(routes, index);

  if (invite && !isOpen && !isEditScreen) {
    openSheet();
  }

  function handleGoToSync() {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Home'}, {name: 'Sync'}],
      }),
    );
  }

  return (
    <BottomSheetModal ref={sheetRef} isOpen={isOpen} onDismiss={resetState}>
      {accept.isSuccess ? (
        <BottomSheetContent
          loading={false}
          buttonConfigs={[
            {
              variation: 'outlined',
              onPress: () => {
                navigation.navigate('Home', {screen: 'Map'});
                closeSheet();
              },
              text: formatMessage(m.goToMap),
            },
            {
              onPress: () => {
                handleGoToSync();
                closeSheet();
              },
              text: formatMessage(m.goToSync),
              variation: 'filled',
            },
          ]}
          title={formatMessage(m.success)}
          description={formatMessage(m.youHaveJoined, {
            projName: invite?.projectName || '',
          })}
          icon={<GreenCheck />}
        />
      ) : (
        <BottomSheetContent
          loading={accept.isPending || reject.isPending}
          buttonConfigs={[
            {
              variation: 'outlined',
              onPress: () => {
                reject.mutate(invite, {
                  onSuccess: () => {
                    if (numberOfInvites <= 1) {
                      closeSheet();
                    }
                  },
                });
              },
              text: formatMessage(m.declineInvite),
            },
            {
              variation: 'filled',
              onPress: () => {
                accept.mutate(invite, {
                  onSuccess: () => {
                    clearAllInvites();
                  },
                });
              },
              text: formatMessage(m.acceptInvite),
            },
          ]}
          title={formatMessage(m.joinProject, {
            projName: invite?.projectName || '',
          })}
          description={formatMessage(m.invitedToJoin, {
            projName: invite?.projectName || '',
          })}
          icon={
            <View
              style={{
                borderColor: LIGHT_GREY,
                borderWidth: 1,
                borderRadius: 100,
                alignItems: 'center',
                shadowColor: '#171717',
                shadowOffset: {width: -2, height: 4},
                shadowOpacity: 0.2,
                shadowRadius: 3,
              }}>
              <InviteIcon
                style={{borderWidth: 1, borderColor: LIGHT_GREY}}
                fill={LIGHT_GREY}
                width={60}
                height={60}
              />
            </View>
          }
        />
      )}
    </BottomSheetModal>
  );
};
