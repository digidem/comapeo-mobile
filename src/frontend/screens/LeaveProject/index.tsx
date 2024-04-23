import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from '../../sharedComponents/Button';
import ErrorIcon from '../../images/Error.svg';
import {defineMessages, useIntl} from 'react-intl';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppStackList} from '../../Navigation/AppStack';
import {Text} from '../../sharedComponents/Text';
import {useProjectSettings} from '../../hooks/server/projects';
import {RED} from '../../lib/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from '../../sharedComponents/Touchables';
import {useProjectInvite} from '../../hooks/useProjectInvite';
import {UIActivityIndicator} from 'react-native-indicators';

const m = defineMessages({
  leaveProj: {
    id: 'screens.LeaveProject.leaveProj',
    defaultMessage: 'Leave Project',
  },
  deleteConsentWithName: {
    id: 'screens.LeaveProject.deleteConsentWithName',
    defaultMessage:
      'I understand I will be deleting all data from Project {projectName}from my device.',
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

export const LeaveProject = ({
  navigation,
  route,
}: NativeStackScreenProps<AppStackList, 'LeaveProject'>) => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const [error, setError] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const {accept} = useProjectInvite();

  console.log({accept: accept.status});

  function handleLeavePress() {
    if (!isChecked) {
      setError(true);
      return;
    }

    accept.mutate(
      {inviteId: route.params.inviteId},
      {
        onSuccess: () => {
          navigation.navigate('InviteSuccess');
        },
      },
    );
  }
  return (
    <View style={styles.container}>
      {accept.isPending ? (
        <LeavingProjectProgress />
      ) : (
        <>
          <View style={styles.textContainer}>
            <ErrorIcon />
            <Text
              style={[
                styles.text,
                {marginTop: 20, fontSize: 32, fontWeight: 'bold'},
              ]}>
              {formatMessage(m.leaveProj)}
            </Text>
            <Text style={[styles.text, {marginTop: 10}]}>
              {data?.name
                ? formatMessage(m.removeFromProjWithName, {
                    projectName: data?.name,
                  })
                : formatMessage(m.removeFromProjWithoutName)}
            </Text>
            <View style={{padding: 20}}>
              <TouchableOpacity
                style={styles.check}
                onPress={() => setIsChecked(val => !val)}>
                <MaterialIcons
                  size={32}
                  name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                />
                <Text style={{marginLeft: 10}}>
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
          </View>
          <View style={{width: '100%'}}>
            {accept.isPending ? (
              <UIActivityIndicator style={{marginBottom: 20}} />
            ) : (
              <>
                <Button
                  fullWidth
                  style={{backgroundColor: RED}}
                  variant="contained"
                  onPress={handleLeavePress}>
                  {formatMessage(m.leaveProj)}
                </Button>
                <Button
                  style={{marginTop: 20}}
                  fullWidth
                  variant="outlined"
                  onPress={() => navigation.pop(2)}>
                  {formatMessage(m.cancel)}
                </Button>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const LeavingProjectProgress = ({projectName}: {projectName?: string}) => {
  const {formatMessage} = useIntl();
  return (
    <View>
      <Text style={{fontSize: 32, textAlign: 'center'}}>
        {formatMessage(m.leavingProject, {projectName: projectName || ''})}
      </Text>

      <UIActivityIndicator style={{marginTop: 40}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    padding: 20,
    paddingTop: 80,
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
  check: {
    marginTop: 30,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
