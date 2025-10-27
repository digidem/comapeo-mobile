import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo} from 'react';
import {defineMessages, useIntl} from 'react-intl';

import {useTrackActions, useTrackState} from '../../contexts/TrackStoreContext';
import {
  useEditTrackMutation,
  useTrackQuery,
  useGetPresetById,
} from '../../hooks/server/track';
import TrackIcon from '../../images/Track.svg';
import {Editor} from '../../sharedComponents/Editor';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {TrackDescriptionField} from '../SaveTrack/TrackDescriptionField';
import {HeaderLeft} from './HeaderLeft';
import {
  getLocationHistoryFromTrack,
  getTrackDurationAndDistance,
} from '../../utils/trackMetrics';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {usePresetsQuery} from '../../hooks/server/presets';

export const m = defineMessages({
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
  const {trackId} = route.params;
  const {data: track} = useTrackQuery(trackId);
  const editTrackMutation = useEditTrackMutation();
  const description = useTrackState(state => state.description);
  const {setDescription, clearCurrentTrack, setTrackPreset, setTrackId} =
    useTrackActions();
  const locationHistory = track ? getLocationHistoryFromTrack(track) : [];
  const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);
  const foundPreset = useGetPresetById(track?.presetRef?.docId);
  const preset = useTrackState(state => state.preset);
  const {data: presets} = usePresetsQuery();
  const trackPresets = useMemo(
    () => Array.from(presets ?? []).filter(p => p.geometry.includes('line')),
    [presets],
  );
  const canChoosePreset = trackPresets.length > 0;

  useEffect(() => {
    if (track && typeof track.tags.notes === 'string') {
      setDescription(track.tags.notes);
    }
  }, [track, setDescription]);

  useEffect(() => {
    if (
      !preset &&
      track?.presetRef?.docId &&
      foundPreset?.docId === track.presetRef.docId
    ) {
      setTrackPreset(foundPreset);
    }
  }, [track, foundPreset, setTrackPreset, preset]);

  useEffect(() => {
    if (trackId) {
      setTrackId(trackId);
    }
    return () => {
      setTrackId(null);
    };
  }, [trackId, setTrackId]);

  const presetName = useMemo(() => {
    return preset ? preset.name : formatMessage(m.presetTitle);
  }, [preset, formatMessage]);

  const saveTrack = useCallback(() => {
    if (!track?.versionId || !track.docId) return;

    editTrackMutation.mutate(
      {
        versionId: track.versionId,
        value: {
          ...track,
          tags: {...track.tags, notes: description},
          presetRef: preset
            ? {docId: preset.docId, versionId: preset.versionId}
            : undefined,
        },
      },
      {
        onSuccess: () => {
          clearCurrentTrack();
          navigation.popTo('Track', {
            trackId: track.docId,
          });
        },
      },
    );
  }, [
    track,
    description,
    editTrackMutation,
    clearCurrentTrack,
    navigation,
    preset,
  ]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: formatMessage(m.trackEditScreenTitle),
        headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
        headerRight: () => (
          <SaveButton
            onPress={saveTrack}
            isLoading={editTrackMutation.status === 'pending'}
          />
        ),
      });
    }, [navigation, formatMessage, saveTrack, editTrackMutation.status]),
  );

  return (
    <Editor
      presetName={presetName}
      notesComponent={<TrackDescriptionField />}
      PresetIcon={
        preset ? (
          <PresetCircleIcon iconId={preset.iconRef?.docId} size="medium" />
        ) : (
          <TrackIcon style={styles.icon} />
        )
      }
      isTrack={true}
      trackDurationMs={durationMs}
      trackDistance={distance}
      presetDisabled={!canChoosePreset}
      onPressPreset={
        canChoosePreset
          ? () => navigation.navigate('TrackCategoryChooser')
          : undefined
      }
    />
  );
};

TrackEdit.navTitle = m.trackEditScreenTitle;

const styles = {
  icon: {width: 30, height: 30},
};
