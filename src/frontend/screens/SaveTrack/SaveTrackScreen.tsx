import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import TrackIcon from '../../images/Track.svg';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {SaveTrackButton} from './SaveTrackButton';
import {Editor} from '../../sharedComponents/Editor';
import {TrackDescriptionField} from './TrackDescriptionField';
import {HeaderLeft} from './HeaderLeft';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        title: t(m.trackEditScreenTitle),
        headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
        headerRight: () => <SaveTrackButton />,
      });
    }, [navigation, t]),
  );

  return (
    <Editor
      audioAttachments={[]}
      photos={[]}
      presetName={t(m.newTitle)}
      notesComponent={<TrackDescriptionField />}
      PresetIcon={<TrackIcon style={styles.icon} />}
      isTrack={true}
      presetDisabled={true}
    />
  );
};

const styles = StyleSheet.create({
  icon: {width: 30, height: 30},
});

export const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.SaveTrack.TrackEditView.title',
    defaultMessage: 'New Track',
    description: 'Title for new track screen',
  },
  newTitle: {
    id: 'screens.SaveTrack.track',
    defaultMessage: 'Track',
    description: 'Category title for new track screen',
  },
});
