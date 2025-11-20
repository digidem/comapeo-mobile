import React from 'react';
import {ScrollView, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useIntl, defineMessages} from 'react-intl';
import Fontisto from '@react-native-vector-icons/fontisto';

import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import NoProjectIcon from '../../images/NoProjectIcon.svg';
import ExchangeIcon from '../../images/Exchange.svg';
import GraphIcon from '../../images/Graph.svg';
import {
  COMAPEO_BLUE,
  NEW_DARK_GREY,
  WHITE,
  VERY_LIGHT_GREY,
  BLACK,
} from '../../lib/styles';
import {
  useActiveArchiveServer,
  useProjectSettings,
} from '../../hooks/server/projects';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';

const m = defineMessages({
  title: {
    id: 'Screens.ProjectSettings.title',
    defaultMessage: 'Coordinator Tools',
  },
  soloDescription: {
    id: 'Screens.ProjectSettings.soloDescription',
    defaultMessage: 'You’re mapping on your own.',
  },
  invite: {
    id: 'Screens.ProjectSettings.invite',
    defaultMessage: 'Invite Collaborators',
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
  projectStatsOn: {
    id: 'Screens.ProjectSettings.projectStatsOn',
    defaultMessage: 'Project Statistics  |  ON',
  },
  projectStatsOff: {
    id: 'Screens.ProjectSettings.projectStatsOff',
    defaultMessage: 'Project Statistics  |  OFF',
  },
  projectStatsOnDesc: {
    id: 'Screens.ProjectSettings.projectStatsOnDesc',
    defaultMessage: 'This project is sharing anonymous statistics.',
  },
  // this is not in the figma or the issue but needed for when stats are off
  projectStatsOffDesc: {
    id: 'Screens.ProjectSettings.projectStatsOffDesc',
    defaultMessage: 'Project statistics are not being shared.',
  },
  update: {id: 'Screens.ProjectSettings.update', defaultMessage: 'Update'},
  view: {id: 'Screens.ProjectSettings.view', defaultMessage: 'View'},
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
  const participantWithRemote =
    projectInfo.role === 'participant' && remoteArchiveOn;

  const displayTitle = isSolo
    ? projectInfo.projectHeader
    : projectInfo.projectName;

  const sendStatsOn = configData.sendStats;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SettingsCardRow
        icon={<NoProjectIcon width={24} height={24} />}
        title={displayTitle}
        subtitle={
          isSolo
            ? formatMessage(m.soloDescription)
            : projectInfo.projectDescription
        }
        buttonText={
          isSolo
            ? formatMessage(m.invite)
            : isCoordinator
              ? formatMessage(m.editInfo)
              : undefined
        }
        onPress={
          isSolo || isCoordinator
            ? () => {
                navigate(isSolo ? 'InviteCollaborators' : 'EditProjectDetails');
              }
            : undefined
        }
      />
      {(isCoordinator || participantWithRemote) && (
        <SettingsCardRow
          icon={<ExchangeIcon width={24} height={24} color={NEW_DARK_GREY} />}
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
          icon={
            <Fontisto name="nav-icon-grid-a" size={24} color={NEW_DARK_GREY} />
          }
          title={formatMessage(m.configTitle)}
          subtitle={configData?.configMetadata?.name}
          buttonText={formatMessage(m.updateCategories)}
          onPress={() => navigate('Config')}
        />
      )}
      {!isSolo && (
        <SettingsCardRow
          icon={<GraphIcon width={24} height={24} color={NEW_DARK_GREY} />}
          title={formatMessage(
            sendStatsOn ? m.projectStatsOn : m.projectStatsOff,
          )}
          subtitle={formatMessage(
            sendStatsOn ? m.projectStatsOnDesc : m.projectStatsOffDesc,
          )}
          buttonText={formatMessage(isCoordinator ? m.update : m.view)}
          onPress={() => navigate('ProjectStatistics')}
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
