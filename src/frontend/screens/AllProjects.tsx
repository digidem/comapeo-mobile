import {useManyProjects} from '@comapeo/core-react';
import * as React from 'react';
import {ListRenderItem, View} from 'react-native';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useActiveProjectIdActions} from '../contexts/ActiveProjectIdStoreContext';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import AddProjectIcon from '../images/AddProject.svg';
import {FlatList} from 'react-native';
import {useTracking} from '../hooks/useTracking';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {ColorCard} from '../sharedComponents/ColorCard';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {COMAPEO_BLUE} from '../lib/styles';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';

const m = defineMessages({
  newCollab: {
    id: 'allProjects.newCollab',
    defaultMessage: 'New Collaboration',
  },
  close: {
    id: 'allProjects.close',
    defaultMessage: 'Close',
  },
});

type ProjectListItem = ReturnType<typeof useManyProjects>['data'][number];

export const AllProjects = () => {
  const {data} = useManyProjects();
  const {projectId: currentProjectId} = useActiveProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {goBack, navigate} = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const {isTracking} = useTracking();

  const dataWithCurrentProjOnTop = data.sort((a, b) => {
    if (a.projectId === currentProjectId) return -1;
    if (b.projectId === currentProjectId) return 1;
    return 0; // Keep original order for other elements
  });
  const handlePressId = React.useCallback(
    (targetProjectId: string) => {
      if (currentProjectId === targetProjectId) {
        goBack();
        return;
      }
      if (isTracking && currentProjectId !== targetProjectId) {
        navigate('TrackRecordingActive');
        return;
      }
      setActiveProjectId(targetProjectId);
      goBack();
    },
    [currentProjectId, isTracking, goBack, navigate, setActiveProjectId],
  );

  const renderItem = React.useCallback<ListRenderItem<ProjectListItem>>(
    ({item}) => {
      const isSelected = item.projectId === currentProjectId;
      return (
        <React.Suspense fallback={<ProjectCardLoader />}>
          <ProjectListItem
            isSelected={isSelected}
            projectId={item.projectId}
            onPress={() => handlePressId(item.projectId)}
          />
        </React.Suspense>
      );
    },
    [handlePressId, currentProjectId],
  );

  return (
    <BottomSheetWrapper>
      <FlatList<ProjectListItem>
        contentContainerStyle={{gap: 20}}
        data={dataWithCurrentProjOnTop}
        keyExtractor={p => p.projectId}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        renderItem={renderItem}
      />

      <PrimaryButton
        fullSize={true}
        onPress={() => {
          //TODO: replace with actual navigation (the collab screens)
          navigate('CreateProject');
        }}
        style={{alignSelf: 'center', marginBottom: 10, marginTop: 20}}
        text={formatMessage(m.newCollab)}
      />
      <SecondaryButton
        fullSize={true}
        style={{alignSelf: 'center'}}
        text={formatMessage(m.close)}
        onPress={() => {
          goBack();
        }}
        renderIcon={() => <AddProjectIcon />}
      />
    </BottomSheetWrapper>
  );
};

const ProjectCardLoader = () => (
  <View
    style={{
      height: 60,
      borderRadius: 12,
      backgroundColor: '#eee',
      marginBottom: 20,
    }}
  />
);

const ProjectListItem = ({
  projectId,
  isSelected,
  onPress,
}: {
  projectId: string;
  onPress: () => void;
  isSelected: boolean;
}) => {
  const projectInfo = useProjectRoleAndDetails(projectId);

  const header =
    'projectHeader' in projectInfo
      ? projectInfo.projectHeader
      : projectInfo.projectName;

  return (
    <ColorCard
      onPress={onPress}
      borderColor={isSelected ? COMAPEO_BLUE : undefined}
      backgroundColor={projectInfo.projectColor}>
      <View style={{padding: 20}}>
        <HeaderText variant="header4">{header}</HeaderText>
      </View>
    </ColorCard>
  );
};
