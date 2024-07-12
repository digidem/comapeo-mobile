import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {useLeaveProject, useProjectSettings} from '../../hooks/server/projects';
import {RED} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from '../../sharedComponents/Touchables';

// import {UIActivityIndicator} from 'react-native-indicators';
import {BottomSheetModalContent} from '../BottomSheetModal';
import {useAcceptInvite} from '../../hooks/server/invites';
import {ErrorBottomSheet} from '../ErrorBottomSheet';

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
};

export const LeaveProject = ({
  inviteId,
  accept,
  closeSheet,
}: LeaveProjectProps) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const [error, setError] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const leaveProject = useLeaveProject();
  const [combinedLoading, setCombinedLoading] = React.useState(false);

  function handleLeavePress() {
    if (!isChecked) {
      setError(true);
      return;
    }
    setCombinedLoading(true);
    leaveProject.mutate(undefined, {
      onSuccess: () => {
        accept.mutate(
          {inviteId},
          {
            onSuccess: () => {
              closeSheet();
              setCombinedLoading(false);
            },
            onError: () => {
              setCombinedLoading(false);
            },
          },
        );
      },
      onError: () => {
        setCombinedLoading(false);
      },
    });
  }

  return (
    <>
      <BottomSheetModalContent
        icon={<ErrorIcon />}
        loading={combinedLoading}
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
          data?.name
            ? formatMessage(m.removeFromProjWithName, {
                projectName: data?.name,
              })
            : formatMessage(m.removeFromProjWithoutName)
        }>
        <View style={{padding: 20}}>
          <TouchableOpacity
            style={styles.check}
            disabled={combinedLoading}
            onPress={() => setIsChecked(val => !val)}>
            <MaterialIcons
              size={32}
              color={!isChecked && error ? RED : undefined}
              name={isChecked ? 'check-box' : 'check-box-outline-blank'}
            />
            <Text style={{marginLeft: 10, marginRight: 10}}>
              {data?.name
                ? formatMessage(m.deleteConsentWithName, {
                    projectName: data?.name,
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

// const LeavingProjectProgress = ({projectName}: {projectName?: string}) => {
//   const {formatMessage} = useIntl();
//   return (
//     <View>
//       <Text style={{fontSize: 32, textAlign: 'center'}}>
//         {formatMessage(m.leavingProject, {projectName: projectName || ''})}
//       </Text>

//       <UIActivityIndicator style={{marginTop: 40}} />
//     </View>
//   );
// };

const styles = StyleSheet.create({
  check: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
