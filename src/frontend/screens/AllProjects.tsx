import {useManyProjects} from '@comapeo/core-react';
import * as React from 'react';
import {ListRenderItem, View} from 'react-native';
import {ProjectInfoCard} from '../sharedComponents/ProjectInfoCard';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails';
import {defineMessages, useIntl} from 'react-intl';
import {NativeNavigationComponent} from '../sharedTypes/navigation';
import {ViewStyleProp} from '../sharedTypes';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useActiveProjectIdActions} from '../contexts/ActiveProjectIdStoreContext';
import {SecondaryButton} from '../sharedComponents/Buttons';
import AddProjectIcon from '../images/AddProject.svg';
import {FlatList} from 'react-native';
import {useTracking} from '../hooks/useTracking';
import {useActiveProject} from '../contexts/ActiveProjectContext';

const m = defineMessages({
  navTitle: {
    id: 'allProjects.navTitle',
    defaultMessage: 'All Projects',
  },
  createNewProject: {
    id: 'allProjects.createNewProject',
    defaultMessage: 'Start new project',
  },
});

type ProjectListItem = ReturnType<typeof useManyProjects>['data'][number];

export const AllProjects: NativeNavigationComponent<'AllProjects'> = () => {
  const {data} = useManyProjects();
  const {projectId: currentProjectId} = useActiveProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {popTo, navigate} = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const {isTracking} = useTracking();

  const handlePressId = React.useCallback(
    (targetProjectId: string) => {
      if (currentProjectId === targetProjectId) {
        popTo('Menu');
        return;
      }
      if (isTracking && currentProjectId !== targetProjectId) {
        navigate('TrackRecordingActive');
        return;
      }
      setActiveProjectId(targetProjectId);
      popTo('Menu');
    },
    [currentProjectId, isTracking, popTo, navigate, setActiveProjectId],
  );

  const renderItem = React.useCallback<ListRenderItem<ProjectListItem>>(
    ({item}) => (
      <React.Suspense fallback={<ProjectCardLoader />}>
        <ProjectInfoCardMinimal
          style={{marginBottom: 20}}
          projectId={item.projectId}
          onPress={() => handlePressId(item.projectId)}
        />
      </React.Suspense>
    ),
    [handlePressId],
  );

  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <SecondaryButton
        fullSize={true}
        style={{alignSelf: 'center', marginBottom: 20}}
        text={formatMessage(m.createNewProject)}
        onPress={() => {
          navigate('StartNewProject');
        }}
        renderIcon={() => <AddProjectIcon />}
      />
      <FlatList<ProjectListItem>
        contentContainerStyle={{padding: 20}}
        data={data}
        keyExtractor={p => p.projectId}
        initialNumToRender={6}
        windowSize={5}
        removeClippedSubviews
        renderItem={renderItem}
      />
    </View>
  );
};

const ProjectCardLoader = () => (
  <View
    style={{
      height: 112,
      borderRadius: 12,
      backgroundColor: '#eee',
      marginBottom: 20,
    }}
  />
);

AllProjects.navTitle = m.navTitle;

const ProjectInfoCardMinimal = React.memo(
  ({
    projectId,
    style,
    onPress,
  }: {
    projectId: string;
    style?: ViewStyleProp;
    onPress: () => void;
  }) => {
    const projectInfo = useProjectRoleAndDetails(projectId);

    const header =
      'projectHeader' in projectInfo
        ? projectInfo.projectHeader
        : projectInfo.projectName;

    return (
      <ProjectInfoCard
        onPress={onPress}
        role={projectInfo.role}
        headerText={header}
        backgroundColor={projectInfo.projectColor}
        style={style}
        testID={`project_card_${header?.toLowerCase().replace(/\s+/g, '_')}`}
      />
    );
  },
);
