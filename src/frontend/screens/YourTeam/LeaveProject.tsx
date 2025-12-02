import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {BLUE_GREY} from '../../lib/styles';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {useLeaveProject, useManyProjects} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectSettings} from '../../hooks/server/projects';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {UIActivityIndicator} from 'react-native-indicators';

const m = defineMessages({
  leaveProjectTitle: {
    id: 'screens.LeaveProject.leaveProjectTitle',
    defaultMessage: 'Leave {projectName}?',
  },
  leaveProjectDescriptionCoordinator: {
    id: 'screens.LeaveProject.leaveProjectDescriptionCoordinator',
    defaultMessage:
      'Device will no longer be able to view, contribute to, or adjust this project.',
  },
  leaveProjectDescriptionParticipant: {
    id: 'screens.LeaveProject.leaveProjectDescriptionParticipant',
    defaultMessage:
      'Device will no longer be able to view or contribute to this project.',
  },
  yesLeave: {
    id: 'screens.LeaveProject.yesLeave',
    defaultMessage: 'Yes, Leave',
  },
  cancel: {
    id: 'screens.LeaveProject.cancel',
    defaultMessage: 'Cancel',
  },
});

export const LeaveProject = ({
  route,
  navigation,
}: NativeRootNavigationProps<'LeaveProject'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const {data: projectSettings} = useProjectSettings();
  const leaveProject = useLeaveProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {data: projects} = useManyProjects();

  const isCoordinator = route.params.memberType === 'coordinator';

  function handleLeaveProject() {
    leaveProject.mutate(
      {projectId},
      {
        onSuccess: () => {
          try {
            navigation.replace('LeftProjectConfirmation');
            const defaultProject = projects?.find(
              project => project.name === undefined,
            );
            if (defaultProject?.projectId) {
              setActiveProjectId(defaultProject.projectId);
            }
          } catch (err) {
            Sentry.captureException(err);
            navigation.replace('ErrorBottomSheet');
          }
        },
        onError: err => {
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet');
        },
      },
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.deviceInfo}>
          <MaterialDesignIcons name="export" size={60} color={BLUE_GREY} />
          <HeaderText variant="header2" style={styles.title}>
            {formatMessage(m.leaveProjectTitle, {
              projectName: projectSettings?.name || '',
            })}
          </HeaderText>
          <BodyText style={styles.description}>
            {formatMessage(
              isCoordinator
                ? m.leaveProjectDescriptionCoordinator
                : m.leaveProjectDescriptionParticipant,
            )}
          </BodyText>
        </View>
      </View>

      <View style={styles.buttons}>
        {leaveProject.status === 'pending' ? (
          <UIActivityIndicator style={{marginVertical: 20}} />
        ) : (
          <>
            <DestructiveButton
              fullSize
              onPress={handleLeaveProject}
              text={formatMessage(m.yesLeave)}
              renderIcon={({color, size}) => (
                <MaterialDesignIcons name="export" size={size} color={color} />
              )}
            />
            <SecondaryButton
              fullSize
              onPress={() => navigation.goBack()}
              text={formatMessage(m.cancel)}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  deviceInfo: {
    gap: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttons: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
  },
});
