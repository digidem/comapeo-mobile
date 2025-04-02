import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import Error from '../../images/Error.svg';
import {Checkbox} from '../../sharedComponents/Checkbox';
import {useState} from 'react';
import {RED} from '../../lib/styles';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useAcceptInvite, useLeaveProject} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {useListenToInviteStateUpdate} from '../../hooks/useListenToInviteStateUpdate';

const m = defineMessages({
  leaveProj: {
    id: 'screens.Invites.LeaveProject.leaveProj',
    defaultMessage: 'Leave Project',
  },
  deleteConsentWithName: {
    id: 'screens.Invites.LeaveProject.deleteConsentWithName',
    defaultMessage:
      'I understand I will be deleting all data from Project {projectName} from my device.',
  },
  deleteConsentWithoutName: {
    id: 'screens.Invites.LeaveProject.deleteConsentWithoutName',
    defaultMessage: 'I understand I will be deleting all data from my device.',
  },
  removeFromProjWithName: {
    id: 'screens.Invites.LeaveProject.removeFromProjWithName',
    defaultMessage:
      "This will remove all Project {projectName}'s data from your device.",
  },
  removeFromProjWithoutName: {
    id: 'screens.Invites.LeaveProject.removeFromProjWithoutName',
    defaultMessage: 'This will remove all of the data from your device.',
  },
  cancel: {
    id: 'screens.Invites.LeaveProject.cancel',
    defaultMessage: 'Cancel',
  },
  checkToConfirm: {
    id: 'screens.Invites.LeaveProject.checkToConfirm',
    defaultMessage: 'Please check the box to confirm',
  },
  leavingProject: {
    id: 'screens.Invites.LeaveProject.leavingProject',
    defaultMessage: 'Leaving Project {projectName}',
  },
});
export const LeaveProject = ({
  route,
  navigation,
}: NativeRootNavigationProps<'LeaveProject'>) => {
  const {formatMessage} = useIntl();
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const accept = useAcceptInvite();
  const projectId = useActiveProjectId();
  const leaveProject = useLeaveProject();
  const {projectName, inviteId} = route.params;

  useListenToInviteStateUpdate(inviteId);

  function handleLeaveProject() {
    if (!isChecked) {
      setError(true);
      return;
    }

    // we want to accept first because the invitor will be able to cancel.
    // this avoids the user leaving a project, and then their invite being cancelled before they were able to join.
    accept.mutate(
      {inviteId},
      {
        onSuccess: projectName => {
          leaveProject.mutate(
            {projectId: projectId!},
            {
              onSuccess: () => {
                navigation.replace('InviteSuccessfullyJoined', {projectName});
              },
              onError: err => {
                Sentry.captureException(err);
                navigation.replace('ErrorBottomSheet');
              },
            },
          );
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet');
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      {accept.status === 'pending' || leaveProject.status === 'pending' ? (
        <View>
          <HeaderText
            style={{textAlign: 'center', marginTop: 80}}
            variant="header2">
            {formatMessage(m.leavingProject, {
              projectName: projectName || '',
            })}
          </HeaderText>

          <UIActivityIndicator />
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <Error style={{alignSelf: 'center', marginTop: 40}} />
            <HeaderText
              style={{textAlign: 'center', marginTop: 20}}
              variant="header2">
              {formatMessage(m.leaveProj)}
            </HeaderText>
            <BodyText
              style={{textAlign: 'center', marginTop: 20}}
              variant="large">
              {projectName
                ? formatMessage(m.removeFromProjWithName, {
                    projectName: projectName,
                  })
                : formatMessage(m.removeFromProjWithoutName)}
            </BodyText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Checkbox
                value={isChecked}
                error={error}
                onPress={() => setIsChecked(val => !val)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              />
              <HeaderText variant="header5" style={{marginLeft: 10}}>
                {projectName
                  ? formatMessage(m.deleteConsentWithName, {
                      projectName: projectName,
                    })
                  : formatMessage(m.deleteConsentWithoutName)}
              </HeaderText>
            </View>
            {error && !isChecked && (
              <HeaderText variant="header5" style={{color: RED, marginTop: 20}}>
                {formatMessage(m.checkToConfirm)}
              </HeaderText>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <DestructiveButton
              fullSize
              onPress={handleLeaveProject}
              text={formatMessage(m.leaveProj)}
            />
            <SecondaryButton
              fullSize
              style={{marginTop: 20}}
              text={formatMessage(m.cancel)}
              onPress={() => {
                navigation.replace('InviteReceived', {inviteId});
              }}
            />
          </View>
        </View>
      )}
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
