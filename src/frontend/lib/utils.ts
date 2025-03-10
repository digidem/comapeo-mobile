// import { Alert } from "react-native";
import {Preset, Observation, Track} from '@comapeo/schema';
import {LocationObject, LocationProviderStatus} from 'expo-location';
import {FeatureCollection, LineString} from 'geojson';

import {LocationHistoryPoint} from '../sharedTypes/location';

// import type {
//   ObservationValue,
//   ObservationAttachment,
// } from "../context/ObservationsContext";
// import type {
//   Preset,
//   PresetsMap,
//   PresetWithFields,
//   FieldsMap,
//   State as Config,
// } from "../context/ConfigContext";

// export function getDisplayName(WrappedComponent: any) {
//   return WrappedComponent.displayName || WrappedComponent.name || "Component";
// }

// Little helper to timeout a promise
// export function promiseTimeout<T>(
//   promise: Promise<T>,
//   ms: number,
//   msg?: string
// ): Promise<T> {
//   let timeoutId: TimeoutID;
//   const timeout = new Promise((resolve, reject) => {
//     timeoutId = setTimeout(() => {
//       reject(new Error(msg || "Timeout after " + ms + "ms"));
//     }, ms);
//   });
//   promise.finally(() => clearTimeout(timeoutId));
//   return Promise.race([promise, timeout]);
// }

// export function parseVersionMajor(versionString?: string = "") {
//   const major = Number.parseInt(versionString.split(".")[0]);
//   return isNaN(major) ? 0 : major;
// }

// If the current position on the app state is more than 60 seconds old then we
// consider it stale and show that the GPS is searching for a new position
const STALE_TIMEOUT = 60 * 1000; // 60 seconds
// // If the precision is less than 10 meters then we consider this to be a "good
// // position" and we change the UI accordingly
const GOOD_PRECISION = 10; // 10 meters

export type LocationStatus = 'searching' | 'improving' | 'good' | 'error';

export function getLocationStatus({
  location,
  providerStatus,
}: {
  location?: LocationObject;
  providerStatus?: LocationProviderStatus;
}): LocationStatus {
  const gpsAvailable = !!providerStatus?.gpsAvailable;
  const locationServicesEnabled = !!providerStatus?.locationServicesEnabled;

  if (!gpsAvailable || !locationServicesEnabled) return 'error';

  const positionStale =
    location && Date.now() - location.timestamp > STALE_TIMEOUT;

  if (positionStale) return 'searching';

  const precision = location?.coords.accuracy;

  if (typeof precision === 'number') {
    return Math.round(precision) <= GOOD_PRECISION ? 'good' : 'improving';
  }

  return 'searching';
}

// export function addFieldDefinitions(
//   preset: Preset,
//   fields: FieldsMap
// ): PresetWithFields {
//   const fieldDefs = Array.isArray(preset.fields)
//     ? preset.fields.map(fieldId => fields.get(fieldId))
//     : [];
//   // $FlowFixMe - Need to figure out how to convert types like this
//   return {
//     ...preset,
//     fields: filterFalsy(fieldDefs),
//   };
// }

// export function getProp(tags: any, fieldKey: Key, defaultValue: any) {
//   // TODO: support deeply nested tags.
//   const shallowKey = Array.isArray(fieldKey) ? fieldKey[0] : fieldKey;
//   const tagValue = tags[shallowKey];
//   return typeof tagValue === "undefined" ? defaultValue : tagValue;
// }

// // This is a helper function to force the type definition
// // It filters an array to remove any falsy values
// function filterFalsy<T>(arr: Array<T | void>): Array<T> {
//   return arr.filter(Boolean);
// }

// export function showWipAlert() {
//   Alert.alert("Work in progress", "This feature has not been implemented yet", [
//     {
//       text: "Ok",
//       onPress: () => {},
//     },
//   ]);
// }

// export function isInPracticeMode(config: Config) {
//   // TODO change how we determine whether we are in practice mode or not
//   return config.metadata.name === "mapeo-default-settings";
// }

/**
 * Finds the best matching preset based on the tags of an observation. It matches the preset tags to the observation tags, following the id-editors convention. This approach allows for tags to be edited and changed in a preset while still maintaining backwards compatibility when necessary
 *
 * @param {Observation['tags']} availableTags - The tags available for matching.
 * @param {Preset[]} presets - The list of presets to match against.
 * @return {Preset | undefined} The best matching preset, or undefined if no match is found.
 */
export function matchPreset(
  availableTags: Observation['tags'],
  presets: Preset[],
): Preset | undefined {
  let bestMatch: Preset | undefined;
  let bestMatchScore = 0;

  presets.forEach(preset => {
    let score = 0;
    const presetTagsCount = Object.keys(preset.tags).length;

    for (const key in preset.tags) {
      // eslint-disable-next-line no-prototype-builtins
      if (preset.tags.hasOwnProperty(key)) {
        const presetTag = preset.tags[key];
        const availableTag = availableTags[key];
        if (presetTag === availableTag) {
          score++;
        } else if (
          Array.isArray(presetTag) &&
          presetTag.includes(availableTag as boolean | number | string | null)
        ) {
          score++;
        }
      }
    }

    // Calculate a score based on how many tags matched
    score = (score / presetTagsCount) * 100;

    // Update the best match if the current preset's score is higher
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatch = preset;
    }
  });

  return bestMatch;
}

export function convertObservationsToFeatures(
  observations: Observation[],
): GeoJSON.Feature[] {
  const accDefault: GeoJSON.Feature[] = [];
  const features: GeoJSON.Feature[] = observations.reduce((acc, obs) => {
    if (typeof obs.lon === 'number' && typeof obs.lat === 'number') {
      return [
        ...acc,
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [obs.lon, obs.lat],
          },
          properties: {
            id: obs.docId,
          },
        },
      ];
    }
    return acc;
  }, accDefault);

  return features;
}

export function convertTracksToFeatures(tracks: Track[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: tracks.map(track => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: track.locations.map(location => [
          location.coords.longitude,
          location.coords.latitude,
        ]),
      },
      properties: {
        timestamps: track.locations.map(location => location.timestamp),
        mocked: track.locations.map(location => location.mocked),
        id: track.docId,
      },
    })),
  };
}

export const convertToLineString = (
  locations: LocationHistoryPoint[],
): LineString => {
  return {
    type: 'LineString',
    coordinates: locations.map(location => [
      location.longitude,
      location.latitude,
    ]),
  };
};
