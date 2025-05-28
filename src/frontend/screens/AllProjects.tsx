import {useManyProjects} from '@comapeo/core-react';
import * as React from 'react';
import {View} from 'react-native';
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
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {useCurrentTrackState} from '../hooks/useTracking';

const m = defineMessages({
  navTitle: {
    id: 'allProjects.navTitle',
    defaultMessage: 'All Projects',
  },
  createNewProject: {
    id: 'allProjects.createNewProject',
    defaultMessage: 'Create new project',
  },
});

export const AllProjects: NativeNavigationComponent<'AllProjects'> = () => {
  const {data} = useManyProjects();
  const {projectId: currentProjectId} = useActiveProject();
  const {setActiveProjectId} = useActiveProjectIdActions();
  const {popTo, navigate} = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const {hasActiveTrack} = useCurrentTrackState();
  return (
    <View style={{flex: 1, paddingTop: 40}}>
      <SecondaryButton
        fullSize={true}
        style={{alignSelf: 'center', marginBottom: 20}}
        text={formatMessage(m.createNewProject)}
        onPress={() => {
          navigate('CreateProject', {action: 'CreateNewProject'});
        }}
        renderIcon={() => <AddProjectIcon />}
      />
      <FlatList
        style={{padding: 20}}
        data={data}
        renderItem={({item}) => {
          function handlePress() {
            if (currentProjectId === item.projectId) {
              popTo('Menu');
              return;
            }

            if (hasActiveTrack && currentProjectId !== item.projectId) {
              navigate('TrackRecordingActive');
              return;
            }
            setActiveProjectId(item.projectId);
            popTo('Menu');
          }
          return (
            <ProjectInfoCardMinimal
              style={{marginBottom: 20}}
              key={item.projectId}
              projectId={item.projectId}
              onPress={handlePress}
            />
          );
        }}
      />
    </View>
  );
};

AllProjects.navTitle = m.navTitle;

const ProjectInfoCardMinimal = ({
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
};
