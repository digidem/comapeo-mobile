import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import InviteIcon from '../../images/AddPersonCircle.svg';
import {StyleSheet, View} from 'react-native';
import {LIGHT_GREY} from '../../lib/styles';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {
  useAcceptInvite,
  useRejectInvite,
  useSingleInvite,
  useManyProjects,
} from '@comapeo/core-react';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {UIActivityIndicator} from 'react-native-indicators';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {useListenToInviteStateUpdate} from '../../hooks/useListenToInviteStateUpdate';

const m = defineMessages({
  navTitle: {
    id: 'screens.InviteReceived.navTitle',
    defaultMessage: 'Invite Received',
  },
  acceptInvite: {
    id: 'screens.InviteReceived.acceptInvite',
    defaultMessage: 'Accept Invite',
  },
  declineInvite: {
    id: 'screens.InviteReceived.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  joinProject: {
    id: 'screens.InviteReceived.joinProject',
    defaultMessage: 'Join {projectName}',
  },
  invitedToJoin: {
    id: 'screens.InviteReceived.invitedToJoin',
    defaultMessage: "You've been invited to join {projectName}",
  },
});

export const InviteReceived: NativeNavigationComponent<'InviteReceived'> = ({
  route,
  navigation,
}) => {
  const {formatMessage} = useIntl();
  const inviteId = route.params.inviteId;
  const {data: invite} = useSingleInvite({inviteId});
  const acceptInvite = useAcceptInvite();
  const rejectInvite = useRejectInvite();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const projects = useManyProjects();

  useListenToInviteStateUpdate(inviteId);

  function accept() {
    if (projects.data.length > 1) {
      navigation.replace('AlreadyOnProject', {inviteId});
      return;
    }
    acceptInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: projectId => {
          setActiveProjectId(projectId);
          navigation.replace('InviteSuccessfullyJoined', {
            projectName: invite.projectName,
          });
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet');
        },
      },
    );
  }

  function reject() {
    rejectInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: () => {
          navigation.goBack();
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
      <View style={styles.inviteIcon}>
        <InviteIcon fill={LIGHT_GREY} width={80} height={80} />
      </View>
      <HeaderText
        style={{textAlign: 'center', marginTop: 20}}
        variant="header2">
        {formatMessage(m.joinProject, {projectName: invite.projectName})}
      </HeaderText>
      <BodyText style={{textAlign: 'center', marginTop: 20}} variant="large">
        {formatMessage(m.invitedToJoin, {projectName: invite.projectName})}
      </BodyText>
      <View style={styles.buttonContainer}>
        {acceptInvite.status === 'pending' ||
        rejectInvite.status === 'pending' ? (
          <UIActivityIndicator style={{marginVertical: 20}} />
        ) : (
          <>
            <SecondaryButton
              fullSize
              onPress={reject}
              text={formatMessage(m.declineInvite)}
            />
            <PrimaryButton
              fullSize
              style={{marginTop: 10}}
              onPress={accept}
              text={formatMessage(m.acceptInvite)}
            />
          </>
        )}
      </View>
    </BottomSheetWrapper>
  );
};

InviteReceived.navTitle = m.navTitle;

const styles = StyleSheet.create({
  inviteIcon: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    alignSelf: 'center',
    width: 80,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});
