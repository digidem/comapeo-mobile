import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {
  useTrackQuery,
  useEditTrackMutation,
  useTrackPresets,
  useGetPresetById,
} from '../../hooks/server/track';

import {StyleSheet, View} from 'react-native';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {PresetView} from '../../sharedComponents/Editor/PresetView';
import {DescriptionField} from '../../sharedComponents/Editor/DescriptionField';
import {LIGHT_GREY} from '../../lib/styles';
import TrackIcon from '../../images/Track.svg';
import {useForm, Controller} from 'react-hook-form';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {
  getLocationHistoryFromTrack,
  getTrackDurationAndDistance,
} from '../../utils/trackMetrics';
import {Divider} from '../../sharedComponents/Divider';
import {TrackStats} from '../../sharedComponents/Editor/TrackStats';
import {ScrollView} from 'react-native-gesture-handler';

const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.TrackEdit.title',
    defaultMessage: 'Edit Track',
    description: 'Title for editing track screen',
  },
  presetTitle: {
    id: 'screens.TrackEdit.track',
    defaultMessage: 'Track',
    description: 'Preset title for new track screen',
  },
});

export const TrackEdit: NativeNavigationComponent<'TrackEdit'> = ({
  navigation,
  route,
}) => {
  const {formatMessage} = useIntl();
  const {mutate, status} = useEditTrackMutation();
  const {trackId} = route.params;
  const {data: track} = useTrackQuery(trackId);

  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);

  // If there is a newPresetId, the user has navigated from the preset chooser page. In otherwords they have selected a new preset for the track (which has not yet been saved).
  const preset = useGetPresetById(
    route.params.newPresetId ?? track?.presetRef?.docId,
  );

  const trackPresets = useTrackPresets();
  const trackPresetsAvailable = trackPresets.length > 0;

  const locationHistory = getLocationHistoryFromTrack(track);
  const {distance, durationMs} = getTrackDurationAndDistance(locationHistory);

  // using react hook form because the save button is in the header. In order to update the notes field and pass it to the save button, we need to use a useEffect (see https://reactnavigation.org/docs/header-buttons#header-interaction-with-its-screen-component). handleSubmit does not cause a re-render when the form values changes, but still has access to the updated values. In other words it does not cause the useEffect to re-run when the notes field changes, but the most updated notes value is still accessible to the header.
  const {control, handleSubmit} = useForm<{notes: string}>({
    defaultValues: {
      notes: typeof track.tags.notes === 'string' ? track.tags.notes : '',
    },
  });

  const saveTrack = React.useCallback(() => {
    handleSubmit(({notes}) => {
      mutate(
        {
          versionId: track.versionId,
          value: {
            ...track,
            tags: {...track.tags, notes: notes},
            presetRef: preset
              ? {docId: preset.docId, versionId: preset.versionId}
              : undefined,
          },
        },
        {
          onSuccess: () => {
            navigation.popTo('Track', {
              trackId: track.docId,
            });
          },
        },
      );
    })();
  }, [handleSubmit, preset, mutate, track, navigation]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SaveButton onPress={saveTrack} isLoading={status === 'pending'} />
      ),
    });
  }, [saveTrack, navigation, status]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.presetContainer}>
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
          presetDisabled={!trackPresetsAvailable}
          onPressPreset={() => {
            if (!trackPresetsAvailable) return;
            navigation.navigate('TrackCategoryChooser', {
              trackAction: 'editExisting',
              trackId: route.params.trackId,
            });
          }}
          PresetIcon={
            preset ? (
              <PresetCircleIcon
                size="medium"
                iconId={preset?.iconRef?.docId}
                testID={`OBS.${preset?.name}-icon`}
                color={preset?.color}
              />
            ) : (
              <TrackIcon style={styles.icon} />
            )
          }
          presetName={preset ? preset.name : formatMessage(m.presetTitle)}
        />
        <Divider />
        <TrackStats distance={distance} durationMs={durationMs} />
      </View>
      <Controller
        control={control}
        name="notes"
        render={({field}) => (
          <DescriptionField notes={field.value} updateNotes={field.onChange} />
        )}
      />
    </ScrollView>
  );
};

TrackEdit.navTitle = m.trackEditScreenTitle;

const styles = StyleSheet.create({
  presetContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
  container: {
    padding: 20,
    flex: 1,
    marginBottom: 40,
  },

  icon: {width: 30, height: 30},
});
