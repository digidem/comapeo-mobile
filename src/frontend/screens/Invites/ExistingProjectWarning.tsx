import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import Error from '../../images/Error.svg';
import {useProjectSettings} from '@comapeo/core-react';
import {useListenToInviteCancel} from '../../hooks/useListenToInviteCancel';
import {useActiveProject} from '../../contexts/ActiveProjectContext';

const m = defineMessages({
  leaveProj: {
    id: 'screens.Invite.ExistingProjectWarning.leaveProj',
    defaultMessage: 'Leave Current Project',
  },
  goBack: {
    id: 'screens.Invite.ExistingProjectWarning.goBack',
    defaultMessage: 'Go Back',
  },
  alreadyOnProject: {
    id: 'screens.Invite.ExistingProjectWarning.alreadyOnProject',
    defaultMessage: 'You are already on a project',
  },
  onProject: {
    id: 'screens.Invite.ExistingProjectWarning.onProject',
    defaultMessage: 'You are on {projectName}',
  },
  leaveWarning: {
    id: 'screens.Invite.AlreadyOnProject.leaveWarning',
    defaultMessage: 'To join a new project you must leave your current one.',
  },
});
export const ExistingProjectWarning = ({
  route,
  navigation,
}: NativeRootNavigationProps<'ExistingProjectWarning'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const {
    data: {name: currentProjectName},
  } = useProjectSettings({projectId: projectId});
  const {inviteId} = route.params;

  useListenToInviteCancel(inviteId);

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Error style={{alignSelf: 'center', marginTop: 40}} />
          <HeaderText
            style={{textAlign: 'center', marginTop: 20}}
            variant="header2">
            {formatMessage(m.alreadyOnProject)}
          </HeaderText>
          {currentProjectName && (
            <BodyText style={{textAlign: 'center', marginTop: 20}}>
              {formatMessage(m.onProject, {projectName: currentProjectName})}
            </BodyText>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <SecondaryButton
            fullSize
            onPress={() => navigation.replace('InviteReceived', {inviteId})}
            text={formatMessage(m.goBack)}
          />
          <PrimaryButton
            fullSize
            style={{marginTop: 20}}
            text={formatMessage(m.leaveProj)}
            onPress={() => {
              navigation.replace('LeaveProject', {
                inviteId,
                currentProjectName,
              });
            }}
          />
        </View>
      </View>
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
