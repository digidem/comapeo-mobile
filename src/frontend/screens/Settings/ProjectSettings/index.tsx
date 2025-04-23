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
  const {navigate} = useNavigationFromRoot();

  const isSolo = role === 'solo';
  const isCoordinator = role === 'coordinator';

  return (
    <SettingsCardRow
      icon={<NoProjectIcon width={24} height={24} />}
      title={displayTitle}
      subtitle={isSolo ? formatMessage(m.soloDescription) : undefined}
      buttonText={
        isSolo
          ? formatMessage(m.invite)
          : isCoordinator
            ? formatMessage(m.editInfo)
            : undefined
      }
      onPress={() =>
        navigate(isSolo ? 'InviteCollaborators' : 'ProjectSettings')
      }
    />
  );
};

const CollaboratorsCard = ({role}: {role: 'coordinator' | 'participant'}) => {
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();

  return (
    <SettingsCardRow
      icon={<ProjectParticipantIcon width={24} height={24} />}
      title={formatMessage(m.projectCollaborators)}
      subtitle={
        role === 'coordinator'
          ? formatMessage(m.coordinator)
          : formatMessage(m.participant)
      }
      buttonText={formatMessage(m.viewTeam)}
      onPress={() => navigate('YourTeam')}
    />
  );
};

const ConfigCard = () => {
  const {formatMessage} = useIntl();
  const {data} = useProjectSettings();
  const {navigate} = useNavigationFromRoot();

  return (
    <SettingsCardRow
      icon={<ProjectCategoriesIcon width={24} height={24} />}
      title={formatMessage(m.configTitle)}
      subtitle={data.configMetadata?.name}
      buttonText={formatMessage(m.updateCategories)}
      onPress={() => navigate('Config')}
    />
  );
};

const SettingsCardRow = ({
  icon,
  title,
  subtitle,
  buttonText,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  buttonText?: string;
  onPress?: () => void;
}) => (
  <ProjectSettingsCard>
    <View style={styles.row}>
      <View style={{marginRight: 16}}>{icon}</View>
      <View style={styles.cardColumn}>
        <HeaderText variant="header5">{title}</HeaderText>
        {!!subtitle && (
          <BodyText variant="smallMeta" style={styles.bodyText}>
            {subtitle}
          </BodyText>
        )}
        {!!buttonText && onPress && (
          <TouchableOpacity
            onPress={onPress}
            style={{marginTop: 8}}
            accessibilityRole="button"
            accessibilityLabel={buttonText}>
            <HeaderText
              variant="header5"
              style={{color: COMAPEO_BLUE, alignSelf: 'flex-start'}}>
              {buttonText}
            </HeaderText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </ProjectSettingsCard>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
});

ProjectSettings.navTitle = m.title;
