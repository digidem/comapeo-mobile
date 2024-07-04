import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation, Preset} from '@mapeo/schema';
import {matchPreset} from '../lib/utils';
import {
  RootStackParamsList,
  DeviceNamingParamsList,
} from '../sharedTypes/navigation';

export function getInitialRouteName(
  initialInfo:
    | {hasDeviceName: false}
    | {
        hasDeviceName: true;
        existingObservation: null | ClientGeneratedObservation | Observation;
        presets: Preset[];
      },
): keyof RootStackParamsList | keyof DeviceNamingParamsList {
  // if user has not set a name, navigate to intro screen where they will be prompted to set a name
  if (!initialInfo.hasDeviceName) {
    return 'IntroToCoMapeo';
  }

  // if no exisiting observation, navigate to home
  if (!initialInfo.existingObservation) {
    return 'Home';
  }

  // if existing observation and no preset match, user has started creating an observation but had not chosen a preset, so navigate to preset chooser
  if (!matchPreset(initialInfo.existingObservation.tags, initialInfo.presets)) {
    return 'PresetChooser';
  }

  // if existing observation, preset match, and docId exists, navigate to Observation Edit Screen
  if ('docId' in initialInfo.existingObservation) {
    return 'ObservationEdit';
  }

  return 'ObservationCreate';
}
