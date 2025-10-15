import * as React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {BLUE_GREY, NEW_DARK_GREY} from '../../lib/styles';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import JoinProjectIcon from '../../images/ProjectParticipant.svg';
import StartNewIcon from '../../images/ProjectCoordinator.svg';
import InviteDevices from '../../images/AddPerson.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  title: {
    id: 'screens.Settings.Collaborate.title',
    defaultMessage: 'Collaborate',
  },
  joinProject: {
    id: 'screens.Settings.Collaborate.joinProject',
    defaultMessage: 'Join a Project',
  },
  startNewProject: {
    id: 'screens.Settings.Collaborate.startNewProject',
    defaultMessage: 'Start New Project',
  },
  inviteDevices: {
    id: 'screens.Settings.Collaborate.inviteDevices',
    defaultMessage: 'Invite Devices',
  },
});

export const Collaborate: NativeNavigationComponent<'Collaborate'> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  const {role} = projectDetails;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <OptionCard
        icon={
          <JoinProjectIcon
            width={24}
            height={24}
            color={NEW_DARK_GREY}
            fill={NEW_DARK_GREY}
          />
        }
        text={t(m.joinProject)}
        onPress={() => navigation.navigate('JoinAProject')}
      />
      <OptionCard
        icon={
          <StartNewIcon
            width={24}
            height={24}
            color={NEW_DARK_GREY}
            fill={NEW_DARK_GREY}
          />
        }
        text={t(m.startNewProject)}
        onPress={() => navigation.navigate('StartNewProjectIntro')}
      />
      {role === 'solo' && (
        <OptionCard
          icon={<InviteDevices width={24} height={24} color={NEW_DARK_GREY} />}
          text={t(m.inviteDevices)}
          onPress={() => navigation.navigate('NameDefaultProjectIntro')}
        />
      )}
    </ScrollView>
  );
};

Collaborate.navTitle = m.title;

type OptionCardProps = {
  icon: React.ReactNode;
  text: string;
  onPress: () => void;
};

function OptionCard({icon, text, onPress}: OptionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.optionCard}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.textContainer}>
        <HeaderText variant="header5">{text}</HeaderText>
      </View>
      <View style={styles.chevronContainer}>
        <MaterialIcons name="chevron-right" size={20} color={NEW_DARK_GREY} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
  },
  textContainer: {
    flex: 1,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
