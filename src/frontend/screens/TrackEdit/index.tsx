import * as React from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {TrackDescriptionField} from '../SaveTrack/TrackDescriptionField';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import TrackIcon from '../../images/Track.svg';
import {HeaderLeft} from './HeaderLeft';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {useFocusEffect} from '@react-navigation/native';
import {useTrackQuery, useEditTrackMutation} from '../../hooks/server/track';

export const TrackEdit = ({route}) => {
  const navigation = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const {trackId} = route.params;

  const {data: track} = useTrackQuery(trackId);
  const editTrackMutation = useEditTrackMutation();
  const {updateNotes, clearCurrentTrack} = usePersistedTrack();

  React.useEffect(() => {
    if (track) {
      updateNotes(track.tags.notes || '');
    }
  }, [track, updateNotes]);

  const saveTrack = () => {
    if (!track) return;

    editTrackMutation.mutate(
      {
        trackId: track.docId,
        updatedTrack: {notes: track.tags.notes},
      },
      {
        onSuccess: () => {
          clearCurrentTrack();
          navigation.goBack();
        },
      },
    );
  };

  useFocusEffect(
    React.useCallback(() => {
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
    }, [navigation, formatMessage, saveTrack, editTrackMutation]),
  );

  return (
    <Editor
      photos={[]}
      presetName={formatMessage(m.trackEditScreenTitle)}
      notesComponent={<TrackDescriptionField />}
      PresetIcon={<TrackIcon style={styles.icon} />}
      isTrack={true}
    />
  );
};

export const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.TrackEdit.title',
    defaultMessage: 'Edit Track',
    description: 'Title for editing track screen',
  },
});

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}): NativeStackNavigationOptions {
  return {
    headerTitle: intl(m.trackEditScreenTitle),
    headerRight: () => <SaveButton onPress={() => {}} isLoading={false} />,
    headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
  };
}

const styles = {
  icon: {width: 30, height: 30},
};
