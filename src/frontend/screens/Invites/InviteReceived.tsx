import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  useAcceptInvite,
  useRejectInvite,
  useSingleInvite,
  useCreateProject,
  useManyProjects,
} from '@comapeo/core-react';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {LoadingIndicator} from '../../sharedComponents/LoadingIndicator';
import * as Sentry from '@sentry/react-native';
import {useListenToInviteCancel} from '../../hooks/useListenToInviteCancel';
import {BLACK, NEW_DARK_GREY, VERY_LIGHT_GREY} from '../../lib/styles';
import {useTracking} from '../../hooks/useTracking';
import GraphIcon from '../../images/Graph.svg';
import CollaborateIcon from '../../images/ProjectParticipant.svg';
import Ionicons from '@react-native-vector-icons/ionicons';

const m = defineMessages({
  join: {
    id: '$1screens.InviteReceived.join',
    defaultMessage: 'Join',
  },
  decline: {
    id: '$1screens.InviteReceived.decline',
    defaultMessage: 'Decline',
  },
  invitedToJoin: {
    id: 'screens.InviteReceived.invitedToJoin',
    defaultMessage: "You've been invited to...",
  },
  joinAsRole: {
    id: '$1screens.InviteReceived.joinAsRole',
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
  sharedStats: {
    id: 'screens.InviteReceived.sharedStats',
    defaultMessage: 'Project statistics are being shared',
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
  const createProject = useCreateProject();
  const {isTracking} = useTracking();
  const {data: allProjects} = useManyProjects();

  const hasDefaultProject = allProjects.some(proj => !proj.name);

  const projectColor = invite.projectColor;
  const statsShared = invite.sendStats;

  useListenToInviteCancel(inviteId);

  function accept() {
    if (isTracking) {
      navigation.navigate('TrackRecordingActive');
      return;
    }

    acceptInvite.mutate(
      {inviteId: inviteId},
      {
        onSuccess: projectId => {
          // In versions before v6, the user did not have to have a default project
          // Now we would like the user to always have a default project
          // This guarantees that
          if (!hasDefaultProject) {
            createProject.mutate(undefined, {
              onError: err => {
                Sentry.captureException(err);
              },
            });
          }

          const isInOnboarding = navigation
            .getState()
            .routes.find(route => route.name === 'JoinProjectIntro');

          // If the user is on the onboarding screen, simply show the invites accepted modal
          if (isInOnboarding) {
            navigation.replace('InviteSuccessfullyAccepted', {
              projectId,
              projectName: invite.projectName,
            });
            return;
          }

          // otherwise reset the navigation so that the stale project is no longer showing.
          navigation.reset({
            index: 1,
            routes: [
              {name: 'Home'},
              {
                name: 'InviteSuccessfullyAccepted',
                params: {projectName: invite.projectName, projectId},
              },
            ],
          });
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet', {error: err});
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
          navigation.replace('ErrorBottomSheet', {error: err});
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

        <View
          style={[
            styles.cardContainer,
            projectColor && {backgroundColor: projectColor},
          ]}>
          <HeaderText variant="header2" style={styles.projectName}>
            {invite.projectName}
          </HeaderText>
          <BodyText variant="smallMeta" style={styles.rolePrompt}>
            {formatMessage(m.joinAsRole, {role: translatedRole})}
          </BodyText>
        </View>

        {statsShared ? (
          <View style={styles.sharedRow}>
            <GraphIcon width={20} height={20} color={NEW_DARK_GREY} />
            <BodyText>{formatMessage(m.sharedStats)}</BodyText>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          {acceptInvite.status === 'pending' ||
          rejectInvite.status === 'pending' ? (
            <LoadingIndicator style={{marginVertical: 20}} />
          ) : (
            <>
              <PrimaryButton
                fullSize
                onPress={accept}
                text={formatMessage(m.join)}
                renderIcon={({color}) => <CollaborateIcon color={color} />}
              />
              <SecondaryButton
                fullSize
                onPress={reject}
                text={formatMessage(m.decline)}
                renderIcon={({color, size}) => (
                  <Ionicons
                    color={color}
                    size={size}
                    name="close-circle-outline"
                  />
                )}
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
  sharedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingTop: 10,
  },
});
