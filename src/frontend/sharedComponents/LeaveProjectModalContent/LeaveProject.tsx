import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {useLeaveProject} from '../../hooks/server/projects';
import {RED} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Sentry from '@sentry/react-native';

import {TouchableOpacity} from '../../sharedComponents/Touchables';

import {UIActivityIndicator} from 'react-native-indicators';
import {BottomSheetModalContent} from '../BottomSheetModal';
import {useAcceptInvite} from '../../hooks/server/invites';
import {ErrorBottomSheet} from '../ErrorBottomSheet';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

const m = defineMessages({
  leaveProj: {
    id: 'screens.LeaveProject.leaveProj',
    defaultMessage: 'Leave Project',
  },
  deleteConsentWithName: {
    id: 'screens.LeaveProject.deleteConsentWithName',
    defaultMessage:
      'I understand I will be deleting all data from Project {projectName} from my device.',
  },
  deleteConsentWithoutName: {
    id: 'screens.LeaveProject.deleteConsentWithoutName',
    defaultMessage: 'I understand I will be deleting all data from my device.',
  },
  removeFromProjWithName: {
    id: 'screens.LeaveProject.removeFromProjWithName',
    defaultMessage:
      "This will remove all Project {projectName}'s data from your device.",
  },
  removeFromProjWithoutName: {
    id: 'screens.LeaveProject.removeFromProjWithoutName',
    defaultMessage: 'This will remove all of the data from your device.',
  },
  cancel: {
    id: 'screens.LeaveProject.cancel',
    defaultMessage: 'Cancel',
  },
  checkToConfirm: {
    id: 'screens.LeaveProject.checkToConfirm',
    defaultMessage: 'Please check the box to confirm',
  },
  leavingProject: {
    id: 'screens.LeaveProject.leavingProject',
    defaultMessage: 'Leaving Project {projectName}',
  },
});

type LeaveProjectProps = {
  inviteId: string;
  accept: ReturnType<typeof useAcceptInvite>;

  closeSheet: () => void;
  projectName?: string;
};

export const LeaveProject = ({
  inviteId,
  accept,
  closeSheet,
  projectName,
}: LeaveProjectProps) => {
  const {formatMessage} = useIntl();
  const [error, setError] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const leaveProject = useLeaveProject();
  const {projectId} = useActiveProject();

  function handleLeavePress() {
    if (!isChecked) {
      setError(true);
      return;
    }
    // we want to accept first because the invitor will be able to cancel.
    // this avoids the user leaving a project, and then their invite being cancelled before they were able to join.
    accept.mutate(
      {inviteId},
      {
        onSuccess: () => {
          leaveProject.mutate(projectId, {
            onSuccess: () => {
              closeSheet();
            },
            onError: err => {
              Sentry.captureException(err);
            },
          });
        },
        onError: err => {
          Sentry.captureException(err);
        },
      },
    );
  }

  return (
    <>
      {accept.status === 'pending' ||
      leaveProject.status === 'pending' ||
      // Prevents a flicker back to non-pending UI while the sheet containing this component
      // is being closed after both succeed
      (accept.status === 'success' && leaveProject.status === 'success') ? (
        <LeavingProjectProgress projectName={projectName} />
      ) : (
        <BottomSheetModalContent
          icon={<ErrorIcon />}
          buttonConfigs={[
            {
              onPress: handleLeavePress,
              text: formatMessage(m.leaveProj),
              variation: 'filled',
              dangerous: true,
            },
            {
              onPress: closeSheet,
              text: formatMessage(m.cancel),
              variation: 'outlined',
            },
          ]}
          title={formatMessage(m.leaveProj)}
          description={
            projectName
              ? formatMessage(m.removeFromProjWithName, {
                  projectName: projectName,
                })
              : formatMessage(m.removeFromProjWithoutName)
          }>
          <View style={{padding: 20}}>
            <TouchableOpacity
              style={styles.check}
              onPress={() => setIsChecked(val => !val)}>
              <MaterialIcons
                size={32}
                color={!isChecked && error ? RED : undefined}
                name={isChecked ? 'check-box' : 'check-box-outline-blank'}
              />
              <Text style={{marginLeft: 10, marginRight: 10}}>
                {projectName
                  ? formatMessage(m.deleteConsentWithName, {
                      projectName: projectName,
                    })
                  : formatMessage(m.deleteConsentWithoutName)}
              </Text>
            </TouchableOpacity>
            {error && !isChecked && (
              <Text style={{color: RED, marginTop: 20}}>
                {formatMessage(m.checkToConfirm)}
              </Text>
            )}
          </View>
        </BottomSheetModalContent>
      )}
      <ErrorBottomSheet
        error={leaveProject.error || accept.error}
        clearError={() => {
          leaveProject.reset();
          accept.reset();
        }}
        tryAgain={handleLeavePress}
      />
    </>
  );
};

const LeavingProjectProgress = ({projectName}: {projectName?: string}) => {
  const {formatMessage} = useIntl();
  return (
    <BottomSheetModalContent
      title={formatMessage(m.leavingProject, {
        projectName: projectName || '',
      })}
      titleStyle={{marginTop: 80}}
      description={<UIActivityIndicator />}
    />
  );
};

const styles = StyleSheet.create({
  check: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
