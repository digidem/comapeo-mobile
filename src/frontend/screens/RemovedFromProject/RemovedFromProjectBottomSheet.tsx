import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {StyleSheet, View} from 'react-native';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BLACK} from '../../lib/styles';
import {
  useCreateProject,
  useLeaveProject,
  useManyProjects,
  useOwnRoleInProject,
  useProjectSettings,
} from '@comapeo/core-react';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {useEffect, useState} from 'react';
import {Loading} from '../../sharedComponents/Loading';
import {UIActivityIndicator} from 'react-native-indicators';
import {ColorCard} from '../../sharedComponents/ColorCard';
import {DEFAULT_PROJECT_COLOR} from '../../constants';

const m = defineMessages({
  close: {
    id: 'screens.RemovedFromProjectBottomSheet.close',
    defaultMessage: 'Close',
  },
  title: {
    id: 'screens.RemovedFromProjectBottomSheet.title',
    defaultMessage: 'THIS DEVICE REMOVED FROM…',
  },
  reasonLabel: {
    id: 'screens.RemovedFromProjectBottomSheet.reasonLabel',
    defaultMessage: 'Reason: {reason}',
  },
});

export const RemovedFromProjectBottomSheet = ({
  route,
  navigation,
}: NativeRootNavigationProps<'RemovedFromProjectBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {projectId} = route.params;
  const {
    data: {reason},
  } = useOwnRoleInProject({projectId});
  const {
    data: {name, projectColor},
  } = useProjectSettings({projectId});
  const {data: projects} = useManyProjects();
  const defaultProject = projects.find(proj => !proj.name);
  const [defaultProjectId, setdefaultProjectId] = useState<string | null>(
    defaultProject ? defaultProject.projectId : null,
  );
  const {setActiveProjectId} = useActiveProjectIdActions();
  const createProject = useCreateProject();
  const leaveProject = useLeaveProject();

  // The user should ALWAYS have a default (solo) project. This was not implemented until after v6. So this creates one if it does not exist
  useEffect(() => {
    if (defaultProjectId) return;
    createProject.mutate(undefined, {
      onError: () => {
        navigation.navigate('ErrorBottomSheet');
      },
      onSuccess: projectId => {
        setdefaultProjectId(projectId);
      },
    });
  }, [createProject, setdefaultProjectId, navigation, defaultProjectId]);

  return (
    <BottomSheetWrapper>
      {!defaultProjectId ? (
        <Loading />
      ) : (
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
            {leaveProject.status === 'pending' ? (
              <UIActivityIndicator style={{margin: 20}} />
            ) : (
              <SecondaryButton
                fullSize
                onPress={() => {
                  leaveProject.mutate(
                    {projectId},
                    {
                      onSuccess: () => {
                        setActiveProjectId(defaultProjectId);
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
      )}
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
