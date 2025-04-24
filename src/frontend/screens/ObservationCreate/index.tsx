import * as React from 'react';
import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderLeft} from './HeaderLeft';
import {ActionsRow} from '../../sharedComponents/ActionsRow';
import {useDraftObservationState} from '../../contexts/DraftObservationContext';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {StyleSheet, View} from 'react-native';
import {Divider} from '../../sharedComponents/Divider';
import {LocationView} from '../../sharedComponents/Editor/LocationView';
import {PresetView} from '../../sharedComponents/Editor/PresetView';
import {LIGHT_GREY} from '../../lib/styles';
import {DescriptionField} from '../../sharedComponents/Editor/DescriptionField';
import {MediaScrollView} from '../../sharedComponents/MediaScrollView';
import {isAudio, isPhoto} from '../../lib/attachmentTypeChecks';
import {SaveButtonCreate} from './SaveButtonCreate';

const m = defineMessages({
  observation: {
    id: 'screens.ObservationCreate.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
  navTitle: {
    id: 'screens.ObservationCreate.navTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
});

export const ObservationCreate = ({
  navigation,
}: NativeRootNavigationProps<'ObservationCreate'>) => {
  const {formatMessage} = useIntl();
  const preset = useDraftObservationState(state => state.value?.presetRef);
  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);
  const attachments = useDraftObservationState(
    state => state.unsavedAttachments,
  );

  const photoAndAudioAttachments = !attachments
    ? []
    : Array.from(attachments.values()).filter(att => {
        return isAudio(att) || isPhoto(att);
      });

  return (
    <ScreenContentWithDock
      dockContainerStyle={{padding: 0}}
      dockContent={<ActionsRow fieldRefs={preset?.fieldRefs} />}>
      <View style={styles.container}>
        <PresetView
          presetName={presetName}
          onPressPreset={() => navigation.popTo('PresetChooser')}
          PresetIcon={
            <PresetCircleIcon
              iconId={preset?.docId}
              size="medium"
              testID={`OBS.${preset?.name}-icon`}
            />
          }
        />
        <Divider />
        <LocationView />
        <DescriptionField />
        {photoAndAudioAttachments && (
          <MediaScrollView attachments={photoAndAudioAttachments} />
        )}
      </View>
    </ScreenContentWithDock>
  );
};

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.navTitle),
      headerRight: () => <SaveButtonCreate />,
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
    };
  };
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
  },
});
