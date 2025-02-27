import * as React from 'react';

import {MessageDescriptor, defineMessages, useIntl} from 'react-intl';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

import {SaveButton} from '../../sharedComponents/SaveButton';

import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {HeaderLeft} from './HeaderLeft';
import {useDraftObservationState} from '../../contexts/DraftObservationContext';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {ActionsRow} from '../../sharedComponents/ActionsRow';
import {PresetView} from './PresetView';
import {PresetCircleIcon} from '../../sharedComponents/icons/PresetIcon';
import {LocationView} from './LocationView';
import {DescriptionField} from './DescriptionField';
import {MediaScroll} from '../../sharedComponents/MediaScroll';

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
  changePreset: {
    id: 'screens.ObservationCreate.changePreset',
    defaultMessage: 'Change',
  },
  descriptionPlaceholder: {
    id: 'screens.ObservationCreate.descriptionPlaceholder',
    defaultMessage: 'What is happening here?',
    description: 'Placeholder for description/notes field',
  },
  noGpsTitle: {
    id: 'screens.ObservationCreate.noGpsTitle',
    defaultMessage: 'No GPS signal',
    description: 'Title of dialog when trying to save with no GPS coords',
  },
  noGpsDesc: {
    id: 'screens.ObservationCreate.noGpsDesc',
    defaultMessage:
      'This observation does not have a location. You can continue waiting for a GPS signal, save the observation without a location, or enter coordinates manually',
    description: 'Description in dialog when trying to save with no GPS coords',
  },
  weakGpsTitle: {
    id: 'screens.ObservationCreate.weakGpsTitle',
    defaultMessage: 'Weak GPS signal',
    description: 'Title of dialog when trying to save with low GPS accuracy.',
  },
  weakGpsDesc: {
    id: 'screens.ObservationCreate.weakGpsDesc',
    defaultMessage:
      'GPS accuracy is low. You can continue waiting for better accuracy, save the observation with low accuracy, or enter coordinates manually',
    description:
      'Description in dialog when trying to save with low GPS accuracy.',
  },
  saveAnyway: {
    id: 'screens.ObservationCreate.saveAnyway',
    defaultMessage: 'Save',
    description: 'Button to save regardless of GPS state',
  },
  manualEntry: {
    id: 'screens.ObservationCreate.manualEntry',
    defaultMessage: 'Manual Coords',
    description: 'Button to manually enter GPS coordinates',
  },
  keepWaiting: {
    id: 'screens.ObservationCreate.keepWaiting',
    defaultMessage: 'Continue waiting',
    description: 'Button to cancel save and continue waiting for GPS',
  },
  audioButton: {
    id: 'screens.ObservationEdit.ObservationEditView.audioButton',
    defaultMessage: 'Audio',
    description: 'Button label for adding audio',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Photo',
    description: 'Button label for adding photo',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.detailsButton',
    defaultMessage: 'Details',
    description: 'Button label to add details',
  },
});

export const ObservationCreate = ({
  navigation,
}: NativeRootNavigationProps<'ObservationCreate'>) => {
  const {formatMessage} = useIntl();
  const preset = useDraftObservationState(state => state.value?.presetRef);
  const unsavedAttachments = useDraftObservationState(
    state => state.unsavedAttachments,
  );

  const presetName = preset
    ? formatMessage({
        id: `presets.${preset.docId}.name`,
        defaultMessage: preset.name,
      })
    : formatMessage(m.observation);

  return (
    <ScreenContentWithDock
      dockContent={<ActionsRow fieldRefs={preset?.fieldRefs} />}>
      <PresetView
        presetName={presetName}
        onPressPreset={() => {
          navigation.popTo('PresetChooser');
        }}
        PresetIcon={
          <PresetCircleIcon
            size="medium"
            iconId={preset?.iconRef?.docId}
            testID={`OBS.${preset?.name}-icon`}
          />
        }
      />
      <LocationView />
      <DescriptionField />
      {unsavedAttachments && unsavedAttachments.size > 0 && (
        <MediaScroll attachmentLength={unsavedAttachments.size}>
          <></>
        </MediaScroll>
      )}
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
      headerRight: () => <SaveButton onPress={() => {}} isLoading={false} />,
      headerLeft: props => <HeaderLeft headerBackButtonProps={props} />,
    };
  };
}
