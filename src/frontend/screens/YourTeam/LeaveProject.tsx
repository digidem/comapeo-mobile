import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {CommonActions} from '@react-navigation/native';
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
import {useClientApi, useLeaveProject} from '@comapeo/core-react';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectSettings} from '../../hooks/server/projects';
import {useEnsureDefaultProject} from '../../hooks/server/useEnsureDefaultProject';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import * as Sentry from '@sentry/react-native';
import {UIActivityIndicator} from 'react-native-indicators';
import {toError} from '../../utils/errors';

const m = defineMessages({
  leaveProjectTitle: {
    id: '$1screens.LeaveProject.leaveProjTitle',
    defaultMessage: 'Leave this project?',
  },
  leaveProjectDescriptionCoordinator: {
    id: 'screens.LeaveProject.leaveProjectDescriptionCoordinator',
    defaultMessage:
      'This device will no longer be able to view, contribute to, or adjust the project {projectName}.',
  },
  leaveProjectDescriptionParticipant: {
    id: 'screens.LeaveProject.leaveProjectDescriptionParticipant',
    defaultMessage:
      'This device will no longer be able to view or contribute to the project {projectName}.',
  },
  yesLeave: {
    id: '$1screens.LeaveProject.yesLeave',
    defaultMessage: 'Yes, Leave',
  },
  cancel: {
    id: '$1screens.LeaveProject.cancel',
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
  const ensureDefaultProject = useEnsureDefaultProject();
  const clientApi = useClientApi();
  const [isFinalizing, setIsFinalizing] = React.useState(false);

  const isCoordinator = route.params.memberType === 'coordinator';

  async function finalizeLeave() {
    try {
      const defaultProjectId = await ensureDefaultProject({
        excludeProjectId: projectId,
      });
      setActiveProjectId(defaultProjectId);
      // Reset (rather than replace) so that no screen with queries
      // scoped to the left project stays mounted — refetching them
      // errors because leaving closes the project's data stores.
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {name: 'Home'},
            {
              name: 'LeftProjectConfirmation',
              params: {projectName: projectSettings.name ?? ''},
            },
          ],
        }),
      );
    } catch (err) {
      setIsFinalizing(false);
      Sentry.captureException(err);
      navigation.replace('ErrorBottomSheet', {
        error: toError(err, 'Error updating active project'),
      });
    }
  }

  function handleLeaveProject() {
    leaveProject.mutate(
      {projectId},
      {
        onSuccess: () => {
          setIsFinalizing(true);
          finalizeLeave();
        },
        onError: async err => {
          // Core marks the project left locally before waiting for sync, so a
          // sync timeout can reject after the project has actually been left.
          setIsFinalizing(true);
          const wasActuallyLeft = await clientApi.listProjects().then(
            projects =>
              !projects.some(project => project.projectId === projectId),
            () => false,
          );
          if (wasActuallyLeft) {
            finalizeLeave();
            return;
          }
          setIsFinalizing(false);
          Sentry.captureException(err);
          navigation.replace('ErrorBottomSheet', {error: err});
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
            {formatMessage(m.leaveProjectTitle)}
          </HeaderText>
          <BodyText style={styles.description}>
            {formatMessage(
              isCoordinator
                ? m.leaveProjectDescriptionCoordinator
                : m.leaveProjectDescriptionParticipant,
              {projectName: projectSettings.name ?? ''},
            )}
          </BodyText>
        </View>
      </View>

      <View style={styles.buttons}>
        {leaveProject.status === 'pending' || isFinalizing ? (
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
