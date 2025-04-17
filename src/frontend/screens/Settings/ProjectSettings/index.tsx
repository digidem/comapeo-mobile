import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';

import {useActiveProject} from '../../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import {ProjectSettingsCard} from '../../../sharedComponents/ProjectSettingsCard';
import NoProjectIcon from '../../../images/NoProjectIcon.svg';
import ProjectParticipantIcon from '../../../images/ProjectParticipant.svg';
import ProjectCategoriesIcon from '../../../images/ProjectCategories.svg';
import {COMAPEO_BLUE, NEW_DARK_GREY} from '../../../lib/styles';
import {useProjectSettings} from '../../../hooks/server/projects';
import {useNavigationFromRoot} from '../../../hooks/useNavigationWithTypes';

const m = defineMessages({
  title: {
    id: 'Screens.ProjectSettings.title',
    defaultMessage: 'Project Settings',
  },
  soloDescription: {
    id: 'Screens.ProjectSettings.soloDescription',
    defaultMessage: 'You’re mapping on your own.',
  },
  coordinator: {
    id: 'Screens.ProjectSettings.coordinator',
    defaultMessage: 'This device is a coordinator on this project.',
  },
  participant: {
    id: 'Screens.ProjectSettings.participant',
    defaultMessage: 'This device is a participant on this project.',
  },
  invite: {
    id: 'Screens.ProjectSettings.invite',
    defaultMessage: 'Invite Collaborators',
  },
  projectCollaborators: {
    id: 'Screens.ProjectSettings.projectCollaborators',
    defaultMessage: 'Project Collaborators',
  },
  viewTeam: {
    id: 'Screens.ProjectSettings.viewTeam',
    defaultMessage: 'View Team',
  },
  configTitle: {
    id: 'Screens.ProjectSettings.configTitle',
    defaultMessage: 'Project Categories',
  },
  updateCategories: {
    id: 'Screens.ProjectSettings.updateCategories',
    defaultMessage: 'Update Set',
  },
  editInfo: {
    id: 'Screens.ProjectSettings.editInfo',
    defaultMessage: 'Edit Info',
  },
});

export const ProjectSettings = () => {
  const {projectId} = useActiveProject();
  const projectInfo = useProjectRoleAndDetails(projectId);

  const displayTitle =
    projectInfo.role === 'solo'
      ? projectInfo.projectHeader
      : projectInfo.projectName;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProjectInfoCard role={projectInfo.role} displayTitle={displayTitle} />
      {projectInfo.role !== 'solo' && (
        <CollaboratorsCard role={projectInfo.role} />
      )}
      {projectInfo.role !== 'participant' && <ConfigCard />}
    </ScrollView>
  );
};

const ProjectInfoCard = ({
  role,
  displayTitle,
}: {
  role: 'coordinator' | 'participant' | 'solo';
  displayTitle: string;
}) => {
  const {formatMessage} = useIntl();
  const isSolo = role === 'solo';
  const isCoordinator = role === 'coordinator';
  const {navigate} = useNavigationFromRoot();

  const onNavigate = () => {
    if (isSolo) {
      navigate('InviteCollaborators');
    } else {
      // I have no idea where someone would go to edit a project name
      navigate('ProjectSettings');
    }
  };
  return (
    <ProjectSettingsCard>
      <View style={styles.row}>
        <View>
          <NoProjectIcon width={24} height={24} />
        </View>
        <View style={styles.cardColumn}>
          <HeaderText variant="header5">{displayTitle}</HeaderText>
          {isSolo ? (
            <BodyText variant="smallMeta" style={styles.bodyText}>
              {formatMessage(m.soloDescription)}
            </BodyText>
          ) : null}

          {isSolo || isCoordinator ? (
            <TouchableOpacity
              onPress={onNavigate}
              style={{marginTop: 8}}
              accessibilityRole="button"
              accessibilityLabel="Go to Edit Project Name">
              <HeaderText
                variant="header5"
                style={{
                  color: COMAPEO_BLUE,
                  textAlign: 'left',
                  alignSelf: 'flex-start',
                }}>
                {isSolo ? formatMessage(m.invite) : formatMessage(m.editInfo)}
              </HeaderText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ProjectSettingsCard>
  );
};

const CollaboratorsCard = ({
  role,
}: {
  role: 'coordinator' | 'participant' | 'solo';
}) => {
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();

  return (
    <ProjectSettingsCard>
      <View style={styles.row}>
        <View>
          <ProjectParticipantIcon width={24} height={24} />
        </View>
        <View style={styles.cardColumn}>
          <HeaderText variant="header5">
            {formatMessage(m.projectCollaborators)}
          </HeaderText>
          <BodyText variant="smallMeta" style={styles.bodyText}>
            {role === 'coordinator'
              ? formatMessage(m.coordinator)
              : formatMessage(m.participant)}
          </BodyText>
          <TouchableOpacity
            onPress={() => {
              navigate('YourTeam');
            }}
            style={{marginTop: 8}}
            accessibilityRole="button"
            accessibilityLabel="Go To Your Team">
            <HeaderText
              variant="header5"
              style={{color: COMAPEO_BLUE, alignSelf: 'flex-start'}}>
              {formatMessage(m.viewTeam)}
            </HeaderText>
          </TouchableOpacity>
        </View>
      </View>
    </ProjectSettingsCard>
  );
};

const ConfigCard = () => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const {navigate} = useNavigationFromRoot();
  return (
    <ProjectSettingsCard>
      <View style={styles.row}>
        <View>
          <ProjectCategoriesIcon width={24} height={24} />
        </View>
        <View style={styles.cardColumn}>
          <HeaderText variant="header5">
            {formatMessage(m.configTitle)}
          </HeaderText>
          <BodyText variant="smallMeta" style={styles.bodyText}>
            {data.configMetadata?.name}
          </BodyText>
          <TouchableOpacity
            onPress={() => {
              navigate('Config');
            }}
            style={{paddingTop: 4}}
            accessibilityRole="button"
            accessibilityLabel="Go to Update Categories">
            <HeaderText
              variant="header5"
              style={{color: COMAPEO_BLUE, alignSelf: 'flex-start'}}>
              {formatMessage(m.updateCategories)}
            </HeaderText>
          </TouchableOpacity>
        </View>
      </View>
    </ProjectSettingsCard>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  cardColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 8,
  },
  bodyText: {
    color: NEW_DARK_GREY,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 20,
  },
});

ProjectSettings.navTitle = m.title;
