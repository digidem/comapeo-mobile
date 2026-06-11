import * as React from 'react';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BLACK} from '../lib/styles';
import {
  useLeaveProject,
  useOwnRoleInProject,
  useProjectSettings,
} from '@comapeo/core-react';
import * as Sentry from '@sentry/react-native';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useActiveProjectIdActions} from '../contexts/ActiveProjectIdStoreContext';
import {useEnsureDefaultProject} from '../hooks/server/useEnsureDefaultProject';
import {UIActivityIndicator} from 'react-native-indicators';
import {ColorCard} from '../sharedComponents/ColorCard';
import {DEFAULT_PROJECT_COLOR} from '../constants';
import {toError} from '../utils/errors';

const m = defineMessages({
  close: {
    id: '$1screens.RemovedFromProjectBottomSheet.close',
    defaultMessage: 'Close',
  },
  title: {
    id: '$1screens.RemovedFromProjectBottomSheet.title',
    defaultMessage: 'THIS DEVICE REMOVED FROM…',
  },
  reasonLabel: {
    id: '$1screens.RemovedFromProjectBottomSheet.reasonLabel',
    defaultMessage: 'Reason: {reason}',
  },
});

export const RemovedFromProjectBottomSheet = ({
  navigation,
}: NativeRootNavigationProps<'RemovedFromProjectBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = useActiveProject();
  const {
    data: {reason},
  } = useOwnRoleInProject({projectId});
  const {
    data: {name, projectColor},
  } = useProjectSettings({projectId});
  const {setActiveProjectId} = useActiveProjectIdActions();
  const ensureDefaultProject = useEnsureDefaultProject();
  const leaveProject = useLeaveProject();
  const [isFinalizing, setIsFinalizing] = React.useState(false);
  // Guards against a second tap landing before the re-render that hides the
  // button — each tap would otherwise leave and create a project (#1940)
  const hasPressedRef = React.useRef(false);

  function handleClose() {
    if (hasPressedRef.current) return;
    hasPressedRef.current = true;
    leaveProject.mutate(
      {projectId},
      {
        onSuccess: async () => {
          setIsFinalizing(true);
          try {
            const defaultProjectId = await ensureDefaultProject({
              excludeProjectId: projectId,
            });
            setActiveProjectId(defaultProjectId);
            navigation.popToTop();
          } catch (err) {
            hasPressedRef.current = false;
            setIsFinalizing(false);
            Sentry.captureException(err);
            navigation.navigate('ErrorBottomSheet', {
              error: toError(err, 'Error creating default project'),
            });
          }
        },
        onError: err => {
          hasPressedRef.current = false;
          Sentry.captureException(err);
          navigation.navigate('ErrorBottomSheet', {error: err});
        },
      },
    );
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <HeaderText variant="header6" style={styles.titleText}>
          {formatMessage(m.title)}
        </HeaderText>

        <ColorCard backgroundColor={projectColor || DEFAULT_PROJECT_COLOR}>
          <View style={{padding: 20, gap: 20}}>
            <HeaderText variant="header2" style={styles.projectName}>
              {name}
            </HeaderText>
            {reason && (
              <HeaderText variant="header5">
                {formatMessage(m.reasonLabel, {reason})}
              </HeaderText>
            )}
          </View>
        </ColorCard>

        <View style={styles.buttonContainer}>
          {leaveProject.status === 'pending' || isFinalizing ? (
            <UIActivityIndicator style={{margin: 20}} />
          ) : (
            <SecondaryButton
              fullSize
              onPress={handleClose}
              text={formatMessage(m.close)}
            />
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  titleText: {
    textTransform: 'uppercase',
    color: BLACK,
  },
  projectName: {
    color: BLACK,
  },
  buttonContainer: {
    paddingTop: 18,
    alignItems: 'center',
  },
});
