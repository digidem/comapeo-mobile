import {ClientGeneratedObservation} from '../sharedTypes';
import {Observation, Preset} from '@mapeo/schema';
import {matchPreset} from '../lib/utils';
import {AppList, DeviceNamingParamList} from '../sharedTypes/navigation';

export function getInitialRouteName(
  initialInfo:
    | {hasDeviceName: false}
    | {
        hasDeviceName: true;
        existingObservation: null | ClientGeneratedObservation | Observation;
        presets: Preset[];
      },
): keyof AppList | keyof DeviceNamingParamList {
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

  // if existing observation and preset match, navigate to observation edit
  return 'ObservationEdit';
}
