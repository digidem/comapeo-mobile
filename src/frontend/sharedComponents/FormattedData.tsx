import * as React from 'react';
import {
  CustomFormatConfig,
  FormattedDate,
  IntlShape,
  defineMessages,
  useIntl,
} from 'react-intl';
import {Field, Observation, Preset} from '@comapeo/schema';

import {formatCoords} from '../lib/coordinateFormat';
import {DateDistance} from './DateDistance';
import {type CoordinateFormat} from '../lib/coordinateFormat';

const m = defineMessages({
  observation: {
    // Keep id stable for translations
    id: 'screens.Observation.ObservationView.observation',
    defaultMessage: 'Observation',
    description: 'Default name of observation with no matching preset',
  },
});

// This is a placeholder. Once we add coordinate format settings, this will read
// from settings context and format accordingly. NB: This does not follow the
// pattern of the other components in this file (which take a Field, Observation
// or Preset as a prop) because it is also used in contexts other than
// observation coords, e.g. for displaying current GPS coords.
export const FormattedCoords = ({
  lat,
  lon,
  format,
}: {
  lat: number;
  lon: number;
  format: CoordinateFormat;
}) => {
  return <>{formatCoords({lon, lat, format})}</>;
};

// Format the created_at date of an observation as either a datetime, or a
// relative datetime (e.g. "3 minutes ago")
export const FormattedObservationDate = React.memo(
  ({
    createdDate,
    variant,
  }: {
    createdDate: string;
    // 'relative' = relative date format e.g. "3 minutes ago"
    // for other formats see formats.date
    variant: 'relative' | CustomFormatConfig['format'];
  }) => {
    // if date format is unixTimeZero convert to a number, else leaves in string format
    const createdAtDate = new Date(
      isNaN(+createdDate) ? createdDate : +createdDate,
    );

    switch (variant) {
      case 'relative':
        return <DateDistance date={createdAtDate} />;
      default:
        return <FormattedDate value={createdAtDate} format={variant} />;
    }
  },
);

// Format the preset name, with a fallback to "Observation" if no preset is
// defined. Core is responsible for translation, so we just use the plain
// string value.
export const FormattedPresetName = ({preset}: {preset?: Preset}) => {
  const {formatMessage: t} = useIntl();
  const name = preset ? preset.name : t(m.observation);

  return <React.Fragment>{name}</React.Fragment>;
};

/**
 *
 * @returns The answers to a field/observation detail, formatted into a readable string.
 * This currently filters out any answer that is null, boolean, or an empty string
 *
 */
export function getFieldAnswerText({
  tagValue,
  fieldOptions,
  formatDate,
}: {
  tagValue?: Observation['tags'][0];
  fieldOptions: Field['options'];
  formatDate: IntlShape['formatDate'];
}): string | undefined {
  if (Array.isArray(tagValue)) {
    return tagValue
      .filter(val => val !== 'null' && val !== '' && typeof val !== 'boolean')
      .map(val => {
        const option = fieldOptions?.find(option => option.value === val);
        if (!option) return val;
        return option.label;
      })
      .join(', ');
  }

  const correspondingLabel = fieldOptions?.find(
    option => option.value === tagValue,
  );

  if (correspondingLabel) {
    return correspondingLabel.label;
  }

  if (isISODateString(tagValue)) {
    return formatDate(tagValue, {
      dateStyle: 'medium',
    });
  }

  if (typeof tagValue === 'number') {
    return String(tagValue);
  }

  if (typeof tagValue === 'string' && !!tagValue) {
    return tagValue;
  }

  return undefined;
}

export function isISODateString(val: unknown): val is string {
  return (
    typeof val === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(val)
  );
}
