import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import Error from '../../images/Error.svg';
import {useProjectSettings} from '@comapeo/core-react';
import {useActiveProjectId} from '../../contexts/ActiveProjectIdStoreContext';
import {useListenToInviteStateUpdate} from '../../hooks/useListenToInviteStateUpdate';

const m = defineMessages({
  leaveProj: {
    id: 'screens.Invite.AlreadyOnProject.leaveProj',
    defaultMessage: 'Leave Current Project',
  },
  goBack: {
    id: 'screens.Invite.AlreadyOnProject.goBack',
    defaultMessage: 'Go Back',
  },
  alreadyOnProject: {
    id: 'screens.Invite.AlreadyOnProject.alreadyOnProject',
    defaultMessage: 'You are already on a project',
  },
  onProject: {
    id: 'screens.Invite.AlreadyOnProject.onProject',
    defaultMessage: 'You are on {projectName}',
  },
  leaveWarning: {
    id: 'screens.Invite.AlreadyOnProject.leaveWarning',
    defaultMessage: 'To join a new project you must leave your current one.',
  },
});
export const AlreadyOnProject = ({
  route,
  navigation,
}: NativeRootNavigationProps<'AlreadyOnProject'>) => {
  const {formatMessage} = useIntl();
  const projectId = useActiveProjectId();
  const {
    data: {name: projectName},
  } = useProjectSettings({projectId: projectId!});
  const inviteId = route.params.inviteId;

  useListenToInviteStateUpdate(inviteId);

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <Error style={{alignSelf: 'center'}} />
        <HeaderText
          style={{textAlign: 'center', marginTop: 20}}
          variant="header2">
          {formatMessage(m.alreadyOnProject)}
        </HeaderText>
        {projectName && (
          <BodyText
            style={{textAlign: 'center', marginTop: 20}}
            variant="large">
            {formatMessage(m.onProject, {projectName: projectName})}
          </BodyText>
        )}
        <View style={styles.buttonContainer}>
          <SecondaryButton
            fullSize
            onPress={() => navigation.goBack()}
            text={formatMessage(m.goBack)}
          />
          <PrimaryButton
            fullSize
            text={formatMessage(m.leaveProj)}
            onPress={() => {
              navigation.replace('LeaveProject', {
                inviteId,
                projectName,
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
  },
});
