import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {SaveTrackButton} from './SaveTrackButton';
import {Editor} from '../../sharedComponents/Editor';
import {TrackDescriptionField} from './TrackDescriptionField';
import {HeaderLeft} from './HeaderLeft';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {useTrackState} from '../../contexts/TrackStoreContext';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();
  const preset = useTrackState(state => state.preset);
  usePreventAndroidBackButton();
  const presetName = preset
    ? t({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : t(m.newTitle);

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
      presetName={presetName}
      notesComponent={<TrackDescriptionField />}
      isTrack={true}
      PresetIcon={
        <PresetCircleIcon iconId={preset?.iconRef?.docId} size="medium" />
      }
      onPressPreset={() =>
        navigation.navigate('PresetChooser', {mode: 'track'})
      }
    />
  );
};

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
