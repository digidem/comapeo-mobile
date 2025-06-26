import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
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
import TrackIcon from '../../images/Track.svg';
import {getTrackDurationAndDistance} from '../../utils/trackMetrics';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();
  const preset = useTrackState(state => state.preset);
  usePreventAndroidBackButton();
  const locationHistory = useTrackState(state => state.locationHistory);
  const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);

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
      trackDurationMs={durationMs}
      trackDistance={distance}
      PresetIcon={
        preset ? (
          <PresetCircleIcon iconId={preset.iconRef?.docId} size="medium" />
        ) : (
          <TrackIcon style={styles.icon} />
        )
      }
      onPressPreset={
        preset ? () => navigation.navigate('TrackCategoryChooser') : undefined
      }
      presetDisabled={preset ? false : true}
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
  },
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
