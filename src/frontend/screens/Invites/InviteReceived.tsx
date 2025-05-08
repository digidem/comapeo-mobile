import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  useAcceptInvite,
  useRejectInvite,
  useSingleInvite,
} from '@comapeo/core-react';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {UIActivityIndicator} from 'react-native-indicators';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {useListenToInviteCancel} from '../../hooks/useListenToInviteCancel';
import {BLACK, NEW_DARK_GREY, VERY_LIGHT_GREY} from '../../lib/styles';

const m = defineMessages({
  joinProject: {
    id: 'screens.InviteReceived.joinProject',
    defaultMessage: 'Join Project',
  },
  declineInvite: {
    id: 'screens.InviteReceived.declineInvite',
    defaultMessage: 'Decline Invite',
  },
  invitedToJoin: {
    id: 'screens.InviteReceived.invitedToJoin',
    defaultMessage: "You've been invited to...",
  },
  joinAsRole: {
    id: 'screens.InviteReceived.joinAsRole',
    defaultMessage: 'Join as a {role}?',
  },
  coordinatorRole: {
    id: 'screens.InviteReceived.coordinatorRole',
    defaultMessage: 'coordinator',
  },
  participantRole: {
    id: 'screens.InviteReceived.participantRole',
    defaultMessage: 'participant',
  },
});

export const InviteReceived = ({
  route,
  navigation,
}: NativeRootNavigationProps<'InviteReceived'>) => {
  const {formatMessage} = useIntl();
  const inviteId = route.params.inviteId;
  const {data: invite} = useSingleInvite({inviteId});
  const translatedRole =
    invite.roleName === 'Coordinator'
      ? formatMessage(m.coordinatorRole)
      : formatMessage(m.participantRole);

  const acceptInvite = useAcceptInvite();
  const rejectInvite = useRejectInvite();
  const {setActiveProjectId} = useActiveProjectIdActions();

  useListenToInviteCancel(inviteId);

  function accept() {
    acceptInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: projectId => {
          setActiveProjectId(projectId);
          navigation.replace('InviteSuccessfullyAccepted', {
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
      <View style={styles.container}>
        <BodyText variant="tinyMeta" style={styles.invitedLabel}>
          {formatMessage(m.invitedToJoin)}
        </BodyText>

        <View style={styles.cardContainer}>
          <HeaderText variant="header2" style={styles.projectName}>
            {invite.projectName}
          </HeaderText>
          <BodyText variant="smallMeta" style={styles.rolePrompt}>
            {formatMessage(m.joinAsRole, {role: translatedRole})}
          </BodyText>
        </View>

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
                onPress={accept}
                text={formatMessage(m.joinProject)}
              />
            </>
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  invitedLabel: {
    textTransform: 'uppercase',
    fontWeight: '500',
    alignSelf: 'stretch',
    color: BLACK,
  },
  cardContainer: {
    backgroundColor: '#fff5eb',
    borderColor: VERY_LIGHT_GREY,
    borderWidth: 1,
    borderRadius: 6,
    padding: 20,
    gap: 20,
    alignSelf: 'stretch',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    elevation: 1,
  },
  projectName: {
    lineHeight: 28,
    color: BLACK,
  },
  rolePrompt: {
    lineHeight: 14,
    color: NEW_DARK_GREY,
  },
  buttonContainer: {
    paddingTop: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});
