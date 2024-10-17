import React, {useEffect, useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useFocusEffect} from '@react-navigation/native';
import {Editor} from '../../sharedComponents/Editor';
import {TrackDescriptionField} from '../SaveTrack/TrackDescriptionField';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {HeaderLeft} from './HeaderLeft';
import {SaveButton} from '../../sharedComponents/SaveButton';
import TrackIcon from '../../images/Track.svg';
import {useTrackQuery, useEditTrackMutation} from '../../hooks/server/track';

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
  const description = usePersistedTrack(state => state.description);
  const setDescription = usePersistedTrack(state => state.setDescription);
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);

  useEffect(() => {
    if (track && typeof track.tags.notes === 'string') {
      setDescription(track.tags.notes);
    }
  }, [track, setDescription]);

  const saveTrack = useCallback(() => {
    if (!track) return;

    editTrackMutation.mutate(
      {
        versionId: track.versionId,
        updatedTrack: {
          ...track,
          tags: {...track.tags, notes: description},
        },
      },
      {
        onSuccess: () => {
          clearCurrentTrack();
          navigation.goBack();
        },
      },
    );
  }, [track, description, editTrackMutation, clearCurrentTrack, navigation]);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: formatMessage(m.trackEditScreenTitle),
        headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
        headerRight: () => (
          <SaveButton
            onPress={saveTrack}
            isLoading={editTrackMutation.isPending}
          />
        ),
      });
    }, [navigation, formatMessage, saveTrack, editTrackMutation.isPending]),
  );

  return (
    <Editor
      audioRecordings={[]}
      photos={[]}
      presetName={formatMessage(m.presetTitle)}
      notesComponent={<TrackDescriptionField />}
      PresetIcon={<TrackIcon style={styles.icon} />}
      isTrack={true}
      presetDisabled={true}
    />
  );
};

TrackEdit.navTitle = m.trackEditScreenTitle;

const styles = {
  icon: {width: 30, height: 30},
};
