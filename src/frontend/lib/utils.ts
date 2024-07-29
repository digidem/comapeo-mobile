// import { Alert } from "react-native";
import {fromLatLon} from 'utm';
import {Preset, Observation} from '@mapeo/schema';
import {LocationObject, LocationProviderStatus} from 'expo-location';

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

// // Coordinates conversions
export function toDegreesMinutesAndSeconds(coordinate: number) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = (minutesNotTruncated - minutes) * 60;
  return {
    degrees,
    minutes,
    seconds,
  };
}

export function convertDmsToDd({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return degrees + minutes / 60 + seconds / 3600;
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function convertToDMS({lat, lon}: {lat: number; lon: number}) {
  const latitude = formatDms(toDegreesMinutesAndSeconds(lat));
  const latitudeCardinal = lat >= 0 ? 'N' : 'S';

  const longitude = formatDms(toDegreesMinutesAndSeconds(lon));
  const longitudeCardinal = lon >= 0 ? 'E' : 'W';
  return `${latitude} ${latitudeCardinal}, ${longitude} ${longitudeCardinal}`;
}

export function convertToUTM({lat, lon}: {lat: number; lon: number}) {
  try {
    const {easting, northing, zoneNum, zoneLetter} = fromLatLon(lat, lon);
    return `UTM ${zoneNum}${zoneLetter} ${easting.toFixed()} ${northing.toFixed()}`;
  } catch (e) {
    // Some coordinates (e.g. < 80S or 84N) cannot be formatted as UTM
    return `${lat >= 0 ? '+' : ''}${lat.toFixed(6)}°, ${
      lon >= 0 ? '+' : ''
    }${lon.toFixed(6)}°`;
  }
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function formatDD({lat, lon}: {lat: number; lon: number}) {
  const formattedLat = Math.abs(lat).toFixed(6);
  const formattedLon = Math.abs(lon).toFixed(6);
  const latCardinal = lat >= 0 ? 'N' : 'S';
  const lonCardinal = lon >= 0 ? 'E' : 'W';
  return `${formattedLat}° ${latCardinal}, ${formattedLon}° ${lonCardinal}`;
}

function formatDms({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return `${degrees}° ${minutes}' ${seconds.toFixed(3)}"`;
}

export function formatCoords({
  lon,
  lat,
  format = 'utm',
}: {
  lon: number;
  lat: number;
  format?: 'utm' | 'dd' | 'dms';
}): string {
  switch (format) {
    case 'dd':
      return formatDD({lat, lon});
    case 'utm':
      return convertToUTM({lat, lon});
    case 'dms':
      return convertToDMS({lat, lon});
    default:
      return convertToUTM({lat, lon});
  }
}

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
    let presetTagsCount = Object.keys(preset.tags).length;
    let matchedTagsCount = 0;

    for (const key in preset.tags) {
      if (preset.tags.hasOwnProperty(key)) {
        const presetTag = preset.tags[key];
        const availableTag = availableTags[key];
        if (presetTag === availableTag) {
          score++;
          matchedTagsCount++;
        } else if (
          Array.isArray(presetTag) &&
          presetTag.includes(availableTag as boolean | number | string | null)
        ) {
          score++;
          matchedTagsCount++;
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
