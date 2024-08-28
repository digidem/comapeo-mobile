import React, {useEffect} from 'react';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {Editor} from '../../sharedComponents/Editor';
import {TrackDescriptionField} from '../SaveTrack/TrackDescriptionField';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import TrackIcon from '../../images/Track.svg';
import {HeaderLeft} from './HeaderLeft';
import {SaveButton} from '../../sharedComponents/SaveButton';
import {useFocusEffect} from '@react-navigation/native';
import {useTrackQuery, useEditTrackMutation} from '../../hooks/server/track';

export const m = defineMessages({
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
  useEffect(() => {
    if (!route.params || !route.params.trackId) {
      navigation.goBack();
    }
  }, [route, navigation]);

  const {trackId} = route.params as {trackId: string};

  const {data: track} = useTrackQuery(trackId);
  const editTrackMutation = useEditTrackMutation();
  const description = usePersistedTrack(state => state.description);
  const setDescription = usePersistedTrack(state => state.setDescription);
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);

  useEffect(() => {
    if (
      track &&
      track.tags.description &&
      typeof track.tags.description === 'string'
    ) {
      setDescription(track.tags.description);
    }
  }, [track, setDescription]);

  const saveTrack = () => {
    if (!track) return;

    editTrackMutation.mutate(
      {
        docId: track.docId,
        updatedTrack: {
          ...track,
          tags: {...track.tags, description},
        },
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

TrackEdit.navTitle = m.trackEditScreenTitle;

const styles = {
  icon: {width: 30, height: 30},
};
