import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useKeepAwake} from 'expo-keep-awake';
import {ErrorBoundary} from '@sentry/react-native';
import {usePreventBackNavigation} from '../../hooks/usePreventBackNavigation';

import {useCancelJoinRequest, useSingleJoinRequest} from '@comapeo/core-react';
import {
  getJoinFailureCopy,
  toJoinFailureCode,
  type JoinFailureCode,
} from './joinFailure';
import {getEventErrorCode} from '../../utils/errors';
import {InviteLinkError} from '../../sharedComponents/InviteLinkError';
import {ProjectCard} from '../../sharedComponents/ProjectCard';
import {InviteRoleRow} from '../../sharedComponents/InviteRoleRow';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {Bar as ProgressBar} from 'react-native-progress';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {COORDINATOR_ROLE_ID} from '../../sharedTypes';
import {
  COMAPEO_BLUE,
  DARK_GREY,
  DARK_GREEN,
  MANGO,
  VERY_LIGHT_GREY,
  WARNING_RED,
  WHITE,
} from '../../lib/styles';
import MaterialIcon from '@react-native-vector-icons/material-icons';
import {StatusCircleIcon} from '../../sharedComponents/StatusCircleIcon';
import SuccessCheck from '../../images/Success.svg';
import type {ReceivedInviteLink} from '../../lib/inviteLinks';
import type {NativeRootNavigationProps} from '../../sharedTypes/navigation';

const m = defineMessages({
  connecting: {
    id: 'screens.Invites.JoinProject.connecting',
    defaultMessage: 'Connecting to Project Coordinator...',
  },
  beingReviewed: {
    id: 'screens.Invites.JoinProject.beingReviewed',
    defaultMessage: 'Request being reviewed...',
  },
  nowJoining: {
    id: 'screens.Invites.JoinProject.nowJoining',
    defaultMessage: 'Request accepted, now joining...',
  },
  keepOpen: {
    id: 'screens.Invites.JoinProject.keepOpen',
    defaultMessage:
      'Both Coordinator and Invited Device must keep CoMapeo open until the request is approved.',
  },
  cancel: {
    id: 'screens.Invites.JoinProject.cancel',
    defaultMessage: 'Cancel',
  },
  joined: {
    id: 'screens.Invites.JoinProject.joined',
    defaultMessage: 'Joined!',
  },
  joinedProject: {
    id: 'screens.Invites.JoinProject.joinedProject',
    defaultMessage: 'This device joined project <bold>{projectName}</bold>',
  },
  viewProject: {
    id: 'screens.Invites.JoinProject.viewProject',
    defaultMessage: 'View Project',
  },
  close: {
    id: 'screens.Invites.JoinProject.close',
    defaultMessage: 'Close',
  },
});

export function JoinProject({
  route,
  navigation,
}: NativeRootNavigationProps<'JoinProject'>) {
  const invite = route.params;

  usePreventBackNavigation();
  useKeepAwake();

  const handleClose = () => navigation.goBack();

  // core drops a join request from memory as soon as it settles, so one that
  // failed before this screen mounted can no longer be read and the query
  // throws instead of reporting a status.
  return (
    <ErrorBoundary
      fallback={() => <JoinFailure code="UNKNOWN" onClose={handleClose} />}>
      <JoinRequestStatus invite={invite} onClose={handleClose} />
    </ErrorBoundary>
  );
}

function JoinRequestStatus({
  invite,
  onClose,
}: {
  invite: ReceivedInviteLink;
  onClose: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const {data: joinRequest} = useSingleJoinRequest({
    inviteId: invite.inviteIdString,
  });
  const {setActiveProjectId} = useActiveProjectIdActions();
  const cancelJoinRequest = useCancelJoinRequest();

  // Leaving the screen does not stop the join, so the request has to be
  // cancelled explicitly or it keeps running with nothing watching it.
  const handleCancel = () =>
    cancelJoinRequest.mutate(
      {inviteId: invite.inviteIdString},
      {onSettled: onClose},
    );

  const {status, projectId} = joinRequest;

  if (status === 'failed') {
    return (
      <JoinFailure
        code={toJoinFailureCode(getEventErrorCode(joinRequest.error))}
        onClose={onClose}
      />
    );
  }

  if (status === 'completed' && projectId) {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <IconTitleDescription
            icon={<SuccessCheck width={100} height={100} />}
            title={t(m.joined)}
            description={
              <FormattedMessage
                {...m.joinedProject}
                values={{
                  projectName: invite.projectName,
                  bold: (chunks: React.ReactNode) => (
                    <HeaderText variant="header5">{chunks}</HeaderText>
                  ),
                }}
              />
            }
          />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            fullSize
            text={t(m.viewProject)}
            onPress={() => setActiveProjectId(projectId)}
          />
          <SecondaryButton fullSize text={t(m.close)} onPress={onClose} />
        </View>
      </View>
    );
  }

  const isJoining = status === 'accepted' || status === 'completed';
  const progressTitle = isJoining
    ? t(m.nowJoining)
    : status === 'connecting'
      ? t(m.connecting)
      : t(m.beingReviewed);

  const badgeColor = isJoining
    ? DARK_GREEN
    : status === 'connecting'
      ? MANGO
      : COMAPEO_BLUE;

  return (
    <JoinProgress
      title={progressTitle}
      badgeColor={badgeColor}
      projectName={invite.projectName}
      isCoordinator={invite.roleId === COORDINATOR_ROLE_ID}
      isJoining={isJoining}
      onCancel={handleCancel}
    />
  );
}

function JoinFailure({
  code,
  onClose,
}: {
  code: JoinFailureCode;
  onClose: () => void;
}) {
  const {formatMessage: t} = useIntl();
  const copy = getJoinFailureCopy(code);

  return (
    <InviteLinkError
      icon={
        <StatusCircleIcon
          icon={copy.icon}
          badge={{color: WARNING_RED, name: 'priority-high'}}
          size={100}
        />
      }
      title={t(copy.title)}
      description={copy.description && t(copy.description)}
      onClose={onClose}
    />
  );
}

function JoinProgress({
  title,
  badgeColor,
  projectName,
  isCoordinator,
  isJoining,
  onCancel,
}: {
  title: string;
  badgeColor: string;
  projectName: string;
  isCoordinator: boolean;
  isJoining: boolean;
  onCancel: () => void;
}) {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <StatusCircleIcon
          icon={{name: 'manage-accounts', color: DARK_GREY}}
          badge={{color: badgeColor, name: isJoining ? 'check' : undefined}}
        />
        <HeaderText variant="header2" style={styles.progressTitle}>
          {title}
        </HeaderText>

        <ProjectCard
          projectName={projectName}
          borderColor={isJoining ? DARK_GREEN : undefined}>
          <InviteRoleRow isCoordinator={isCoordinator} />
        </ProjectCard>

        {/* Indeterminate because join-request-update carries no progress we can
            use. Swap in a real `progress` if core starts sending one. */}
        {isJoining ? (
          <View style={styles.progressContainer}>
            <MaterialIcon
              name="sync"
              size={24}
              color={COMAPEO_BLUE}
              style={styles.syncIcon}
            />
            <ProgressBar
              indeterminate
              indeterminateAnimationDuration={2000}
              width={250}
              height={8}
              borderRadius={0}
              color={COMAPEO_BLUE}
              unfilledColor={VERY_LIGHT_GREY}
              borderWidth={0}
              borderColor={WHITE}
            />
          </View>
        ) : (
          <BodyText variant="smallMeta" style={styles.keepOpen}>
            {t(m.keepOpen)}
          </BodyText>
        )}
      </View>

      {isJoining ? null : (
        <SecondaryButton fullSize text={t(m.cancel)} onPress={onCancel} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  progressTitle: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  progressContainer: {
    gap: 15,
  },
  syncIcon: {
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 12,
  },
  keepOpen: {
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
