import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, FormattedMessage, useIntl} from 'react-intl';
import {useKeepAwake} from 'expo-keep-awake';
import {usePreventBackNavigation} from '../../hooks/usePreventBackNavigation';

import {useJoinRequest} from '../../hooks/useJoinRequest';
import {getJoinFailureCopy} from './joinFailure';
import {InviteLinkError} from '../../sharedComponents/InviteLinkError';
import {ProjectCard} from '../../sharedComponents/ProjectCard';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {Bar as ProgressBar} from 'react-native-progress';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
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
    defaultMessage: 'Coordinator must have CoMapeo open to review and approve.',
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
  const {formatMessage: t} = useIntl();
  const invite = route.params;
  const joinRequest = useJoinRequest(invite);
  const {setActiveProjectId} = useActiveProjectIdActions();

  usePreventBackNavigation();
  useKeepAwake();

  const handleClose = () => navigation.goBack();

  if (joinRequest.status === 'failed') {
    const copy = getJoinFailureCopy(joinRequest.errorCode);
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
        onClose={handleClose}
      />
    );
  }

  if (joinRequest.status === 'completed') {
    const {projectId} = joinRequest;
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
          <SecondaryButton fullSize text={t(m.close)} onPress={handleClose} />
        </View>
      </View>
    );
  }

  const isJoining = joinRequest.status === 'accepted';
  const progressTitle = isJoining
    ? t(m.nowJoining)
    : joinRequest.status === 'connecting'
      ? t(m.connecting)
      : t(m.beingReviewed);

  const badgeColor = isJoining
    ? DARK_GREEN
    : joinRequest.status === 'connecting'
      ? MANGO
      : COMAPEO_BLUE;

  return (
    <JoinProgress
      title={progressTitle}
      badgeColor={badgeColor}
      projectName={invite.projectName}
      isJoining={isJoining}
      onCancel={handleClose}
    />
  );
}

function JoinProgress({
  title,
  badgeColor,
  projectName,
  isJoining,
  onCancel,
}: {
  title: string;
  badgeColor: string;
  projectName: string;
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
          borderColor={isJoining ? DARK_GREEN : undefined}
        />

        {/* Indeterminate because join-request-update we can't calculate progress yet. 
            Swap in a real `progress` if core starts sending
            something we can use. */}
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
