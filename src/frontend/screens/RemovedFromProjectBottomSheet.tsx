import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../sharedTypes/navigation';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {BLACK} from '../lib/styles';
import {
  useCreateProject,
  useLeaveProject,
  useManyProjects,
  useOwnRoleInProject,
  useProjectSettings,
} from '@comapeo/core-react';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useActiveProjectIdActions} from '../contexts/ActiveProjectIdStoreContext';
import {LoadingIndicator} from '../sharedComponents/LoadingIndicator';
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
  const {data: projects} = useManyProjects();
  const defaultProject = projects.find(proj => !proj.name);
  const {setActiveProjectId} = useActiveProjectIdActions();
  const createProject = useCreateProject();
  const leaveProject = useLeaveProject();

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
          {leaveProject.status === 'pending' ||
          createProject.status === 'pending' ? (
            <LoadingIndicator style={{margin: 20}} />
          ) : (
            <SecondaryButton
              fullSize
              onPress={() => {
                leaveProject.mutate(
                  {projectId},
                  {
                    onSuccess: () => {
                      if (!defaultProject) {
                        // The user should ALWAYS have a default (solo) project. This was not implemented until after v6. So this creates one if it does not exist
                        createProject.mutate(undefined, {
                          onError: err => {
                            const firstProject = projects[0];
                            if (firstProject) {
                              setActiveProjectId(firstProject.projectId);
                              navigation.popToTop();
                              return;
                            }
                            navigation.navigate('ErrorBottomSheet', {
                              error: toError(
                                err,
                                'Error creating default project',
                              ),
                            });
                          },
                          onSuccess: newDefaultProjectId => {
                            setActiveProjectId(newDefaultProjectId);
                            navigation.popToTop();
                          },
                        });
                        return;
                      }
                      setActiveProjectId(defaultProject.projectId);
                      navigation.popToTop();
                    },
                  },
                );
              }}
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
