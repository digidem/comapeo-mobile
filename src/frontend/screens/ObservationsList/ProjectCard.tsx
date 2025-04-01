import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BLUE_GREY, VERY_LIGHT_GREY} from '../../lib/styles';
import {useAllProjects} from '../../hooks/server/projects';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {defineMessages, useIntl} from 'react-intl';
import {useOwnRoleInProject} from '@comapeo/core-react';
import {
  COORDINATOR_ROLE_ID,
  CREATOR_ROLE_ID,
  MEMBER_ROLE_ID,
} from '../../sharedTypes';
import ProjectCoordinatorIcon from '../../images/ProjectCoordinator.svg';
import ProjectParticipantIcon from '../../images/ProjectParticipant.svg';
import NoProjectIcon from '../../images/NoProjectIcon.svg';
import {BodyText} from '../../sharedComponents/Text/BodyText';

const m = defineMessages({
  mappingOnYourOwn: {
    id: 'observationsList.ObservationListHeader.mappingOnYourOwn',
    defaultMessage: 'You’re mapping on your own.',
  },
  coordinator: {
    id: 'observationsList.ObservationListHeader.coordinator',
    defaultMessage: 'You’re a coordinator on this project.',
  },
  participant: {
    id: 'observationsList.ObservationListHeader.participant',
    defaultMessage: 'You’re a participant on this project.',
  },
});

export function ProjectCard() {
  const {data} = useAllProjects();
  const {projectId} = useActiveProject();
  const {formatMessage} = useIntl();
  const {data: role} = useOwnRoleInProject({
    projectId: projectId,
  });

  let projectRole = 'solo';
  if (data && data.length > 1) {
    if (
      role.roleId === COORDINATOR_ROLE_ID ||
      role.roleId === CREATOR_ROLE_ID
    ) {
      projectRole = 'coordinator';
    } else if (role.roleId === MEMBER_ROLE_ID) {
      projectRole = 'participant';
    }
  }

  let userRoleText, RoleIcon;
  switch (projectRole) {
    case 'coordinator':
      userRoleText = formatMessage(m.coordinator);
      RoleIcon = ProjectCoordinatorIcon;
      break;
    case 'participant':
      userRoleText = formatMessage(m.participant);
      RoleIcon = ProjectParticipantIcon;
      break;
    default:
      userRoleText = formatMessage(m.mappingOnYourOwn);
      RoleIcon = NoProjectIcon;
      break;
  }

  return (
    <View style={styles.card}>
      <RoleIcon width={20} height={20} />
      <BodyText variant="smallMeta">{userRoleText}</BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    gap: 10,
    backgroundColor: VERY_LIGHT_GREY,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
    alignSelf: 'center',
    width: '90%',
  },
});
