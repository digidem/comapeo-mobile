import React, {useCallback, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useFocusEffect} from '@react-navigation/native';
import {SaveTrackButton} from './SaveTrackButton';
import {TrackDescriptionField} from './TrackDescriptionField';
import {HeaderLeft} from './HeaderLeft';
import {usePreventAndroidBackButton} from '../../hooks/usePreventAndroidBackButton';
import {useTrackState} from '../../contexts/TrackStoreContext';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import TrackIcon from '../../images/Track.svg';
import {getTrackDurationAndDistance} from '../../utils/trackMetrics';
import {usePresetsQuery} from '../../hooks/server/presets';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {LIGHT_GREY} from '../../lib/styles';
import {PresetView} from '../../sharedComponents/PresetView';
import {Divider} from '../../sharedComponents/Divider';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectRoleAndDetails} from '../../hooks/useProjectRoleAndDetails';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {TrackStats} from '../../sharedComponents/TrackStats';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromRoot();
  const {formatMessage: t} = useIntl();
  const preset = useTrackState(state => state.preset);
  usePreventAndroidBackButton();
  const locationHistory = useTrackState(state => state.locationHistory);
  const {durationMs, distance} = getTrackDurationAndDistance(locationHistory);
  const {data: presets} = usePresetsQuery();
  const trackPresets = useMemo(
    () => Array.from(presets ?? []).filter(p => p.geometry.includes('line')),
    [presets],
  );
  const {projectId} = useActiveProject();
  const projectDetails = useProjectRoleAndDetails(projectId);

  const canChoosePreset = trackPresets.length > 0;

  const presetName = preset ? preset.name : t(m.newTitle);

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
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={undefined}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: projectDetails.projectColor,
            paddingVertical: 10,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            paddingHorizontal: 20,
          }}>
          <HeaderText variant="header6">
            {projectDetails.projectHeader}
          </HeaderText>
        </View>
        <PresetView
          presetName={presetName}
          PresetIcon={
            preset ? (
              <PresetCircleIcon iconId={preset.iconRef?.docId} size="medium" />
            ) : (
              <TrackIcon style={styles.icon} />
            )
          }
          onPressPreset={
            canChoosePreset
              ? () =>
                  navigation.navigate('TrackCategoryChooser', {
                    trackAction: 'saveNew',
                  })
              : undefined
          }
          presetDisabled={!canChoosePreset}
        />
        <Divider />
        <TrackStats distance={distance} durationMs={durationMs} />
      </View>
      <TrackDescriptionField />
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
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
