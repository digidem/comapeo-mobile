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
import {useLeaveProject} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectSettings} from '../../hooks/server/projects';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {useClientApi} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {UIActivityIndicator} from 'react-native-indicators';

const m = defineMessages({
  leaveProjectTitle: {
    id: 'screens.LeaveProject.leaveProjectTitle',
    defaultMessage: 'Leave {projectName}?',
  },
  leaveProjectDescription: {
    id: 'screens.LeaveProject.leaveProjectDescription',
    defaultMessage:
      'This device will no longer view or contribute to this project',
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
  navigation,
}: NativeRootNavigationProps<'LeaveProject'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const {data: projectSettings} = useProjectSettings();
  const leaveProject = useLeaveProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {listProjects} = useClientApi();

  function handleLeaveProject() {
    leaveProject.mutate(
      {projectId},
      {
        onSuccess: async () => {
          try {
            const projects = await listProjects();
            if (projects && projects.length > 0) {
              const defaultProject = projects.find(
                project => project.name === undefined,
              );
              if (defaultProject?.projectId) {
                setActiveProjectId(defaultProject.projectId);
              }
            }
            navigation.replace('LeftProjectConfirmation');
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
            {formatMessage(m.leaveProjectDescription)}
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
    padding: 20,
  },
});
