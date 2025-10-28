import * as React from 'react';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {
  useEditTrackMutation,
  useTrackQuery,
  useGetPresetById,
} from '../../hooks/server/track';

import {ActionsRow} from '../../sharedComponents/ActionsRow';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PresetView} from '../../sharedComponents/Editor/PresetView';
import {DescriptionField} from '../../sharedComponents/Editor/DescriptionField';
import {LIGHT_GREY} from '../../lib/styles';

const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.TrackEdit.title',
    defaultMessage: 'Edit Track',
    description: 'Title for editing track screen',
  },
});

export const TrackEdit: NativeNavigationComponent<'TrackEdit'> = ({
  navigation,
  route,
}) => {
  const {formatMessage} = useIntl();
  const {trackId} = route.params;
  const {data: track} = useTrackQuery(trackId);
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);
  //   const editTrackMutation = useEditTrackMutation();
  //   const description = useTrackState(state => state.description);
  //   const {setDescription, clearCurrentTrack, setTrackPreset, setTrackId} =
  //     useTrackActions();
  //   const locationHistory = track ? getLocationHistoryFromTrack(track) : [];
  //   const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);
  //   const foundPreset = useGetPresetById(track?.presetRef?.docId);
  //   const preset = useTrackState(state => state.preset);
  //   const {data: presets} = usePresetsQuery();
  //   const trackPresets = useMemo(
  //     () => Array.from(presets ?? []).filter(p => p.geometry.includes('line')),
  //     [presets],
  //   );
  //   const canChoosePreset = trackPresets.length > 0;

  return (
    <View>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: projectDetails.projectColor,
            paddingVertical: 10,
            // without this the parent container border does not properly show
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingHorizontal: 20,
          }}>
          <HeaderText variant="header6">
            {projectDetails.role === 'solo'
              ? projectDetails.projectHeader
              : projectDetails.projectName}
          </HeaderText>
        </View>
        <PresetView
          onPressPreset={() =>
            navigation.navigate('ObservationCategoryChooser')
          }
          PresetIcon={
            <PresetCircleIcon
              size="medium"
              iconId={preset?.iconRef?.docId}
              testID={`OBS.${preset?.name}-icon`}
              color={preset?.color}
            />
          }
          presetName={presetName}
        />
      </View>
      <DescriptionField
        notes={typeof notes !== 'string' ? '' : notes}
        updateNotes={newVal => {
          updateTags('notes', newVal);
        }}
      />
    </View>
  );
};

TrackEdit.navTitle = m.trackEditScreenTitle;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
