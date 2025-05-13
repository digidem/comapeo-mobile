import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';

import {useActiveProject} from '../../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../../sharedComponents/Text/BodyText';
import NoProjectIcon from '../../../images/NoProjectIcon.svg';
import ProjectParticipantIcon from '../../../images/ProjectParticipant.svg';
import ProjectCategoriesIcon from '../../../images/ProjectCategories.svg';
import ExchangeIcon from '../../../images/Exchange.svg';
import {
  COMAPEO_BLUE,
  NEW_DARK_GREY,
  WHITE,
  VERY_LIGHT_GREY,
  BLACK,
} from '../../../lib/styles';
import {
  useActiveArchiveServer,
  useProjectSettings,
} from '../../../hooks/server/projects';
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
  remoteArchiveOn: {
    id: 'Screens.ProjectSettings.remoteArchiveOn',
    defaultMessage: 'Remote Archive  |  ON',
  },
  remoteArchiveOff: {
    id: 'Screens.ProjectSettings.remoteArchiveOff',
    defaultMessage: 'Remote Archive  |  OFF',
  },
  remoteArchiveDesc: {
    id: 'Screens.ProjectSettings.remoteArchiveDesc',
    defaultMessage:
      'Share with a secure, encypted server. URL required to access.',
  },
  viewDetails: {
    id: 'Screens.ProjectSettings.viewDetails',
    defaultMessage: 'View Details',
  },
});

export const ProjectSettings = () => {
  const {projectId} = useActiveProject();
  const projectInfo = useProjectRoleAndDetails(projectId);
  const {formatMessage} = useIntl();
  const {navigate} = useNavigationFromRoot();
  const {data: configData} = useProjectSettings();
  const isSolo = projectInfo.role === 'solo';
  const isCoordinator = projectInfo.role === 'coordinator';
  const remoteArchiveOn = !!useActiveArchiveServer({projectId});

  const displayTitle = isSolo
    ? projectInfo.projectHeader
    : projectInfo.projectName;

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
      {!isSolo && (
        <SettingsCardRow
          icon={<ProjectParticipantIcon width={24} height={24} />}
          title={formatMessage(m.projectCollaborators)}
          subtitle={
            isCoordinator
              ? formatMessage(m.coordinator)
              : formatMessage(m.participant)
          }
          buttonText={formatMessage(m.viewTeam)}
          onPress={() => navigate('YourTeam')}
        />
      )}
      {isCoordinator && (
        <SettingsCardRow
          icon={<ExchangeIcon width={24} height={24} />}
          title={formatMessage(
            remoteArchiveOn ? m.remoteArchiveOn : m.remoteArchiveOff,
          )}
          subtitle={formatMessage(m.remoteArchiveDesc)}
          buttonText={formatMessage(m.viewDetails)}
          onPress={() => navigate('RemoteArchive')}
        />
      )}
      {projectInfo.role !== 'participant' && (
        <SettingsCardRow
          icon={<ProjectCategoriesIcon width={24} height={24} />}
          title={formatMessage(m.configTitle)}
          subtitle={configData?.configMetadata?.name}
          buttonText={formatMessage(m.updateCategories)}
          onPress={() => navigate('Config')}
        />
      )}
    </ScrollView>
  );
};

type SettingsCardRowProps =
  | {
      icon: React.ReactNode;
      title: string;
      subtitle?: string;
    }
  | {
      icon: React.ReactNode;
      title: string;
      subtitle?: string;
      buttonText: string;
      onPress: () => void;
    };

const SettingsCardRow = (props: SettingsCardRowProps) => {
  const {icon, title, subtitle} = props;
  const hasButton =
    'buttonText' in props && 'onPress' in props && !!props.buttonText;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{marginRight: 16}}>{icon}</View>
        <View style={styles.cardColumn}>
          <HeaderText variant="header5">{title}</HeaderText>
          {!!subtitle && (
            <BodyText variant="smallMeta" style={styles.bodyText}>
              {subtitle}
            </BodyText>
          )}
          {hasButton && (
            <TouchableOpacity
              onPress={props.onPress}
              style={{marginTop: 8}}
              accessibilityRole="button"
              accessibilityLabel={props.buttonText}>
              <HeaderText
                variant="header5"
                style={{color: COMAPEO_BLUE, alignSelf: 'flex-start'}}>
                {props.buttonText}
              </HeaderText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  card: {
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 20,
    gap: 12,
    shadowColor: BLACK,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    backgroundColor: WHITE,
    borderColor: VERY_LIGHT_GREY,
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
