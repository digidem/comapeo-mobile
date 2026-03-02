import {useManyProjects} from '@comapeo/core-react';
import * as React from 'react';
import {ListRenderItem, View} from 'react-native';
import {useProjectRoleAndDetails} from '../hooks/useProjectRoleAndDetails';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {useActiveProjectIdActions} from '../contexts/ActiveProjectIdStoreContext';
import {PrimaryButton, SecondaryButton} from '../sharedComponents/Buttons';
import Ionicons from '@react-native-vector-icons/ionicons';
import {FlatList} from 'react-native';
import {useTracking} from '../hooks/useTracking';
import {useActiveProject} from '../contexts/ActiveProjectContext';
import {ColorCard} from '../sharedComponents/ColorCard';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {COMAPEO_BLUE} from '../lib/styles';
import {BottomSheetWrapper} from '../sharedComponents/BottomSheetWrapper';
import CheckMark from '../images/CheckMark.svg';

const m = defineMessages({
  // primary-string
  newCollab: {
    id: 'allProjects.newCollab',
    defaultMessage: 'New Collaboration',
  },
  // primary-string
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

  const dataWithCurrentProjOnTop = React.useMemo(
    () =>
      [...data].sort((a, b) => {
        if (a.projectId === currentProjectId) return -1;
        if (b.projectId === currentProjectId) return 1;
        return 0; // Keep original order for other elements
      }),
    [currentProjectId, data],
  );

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
    <BottomSheetWrapper closeOnBackButtonPress>
      <FlatList<ProjectListItem>
        contentContainerStyle={{gap: 20, paddingBottom: 2}}
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
          if (isTracking) {
            navigate('TrackRecordingActive');
            return;
          }
          navigate('Collaborate');
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
        renderIcon={({color, size}) => (
          <Ionicons color={color} size={size} name="close-circle-outline" />
        )}
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

  return (
    <ColorCard
      testID={`project_card_${projectInfo.projectHeader?.toLowerCase().replace(/\s+/g, '_')}`}
      onPress={onPress}
      borderColor={isSelected ? COMAPEO_BLUE : undefined}
      backgroundColor={projectInfo.projectColor}>
      <View
        style={{
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}>
        <View style={{flex: 1}}>
          <HeaderText variant="header4">{projectInfo.projectHeader}</HeaderText>
        </View>
        {isSelected && <CheckMark width={24} height={24} />}
      </View>
    </ColorCard>
  );
};
