import * as React from 'react';
import {
  CustomFormatConfig,
  FormattedDate,
  defineMessages,
  useIntl,
} from 'react-intl';
import {Field, Preset} from '@mapeo/schema';

import {formatCoords} from '../lib/utils';
import {DateDistance} from './DateDistance';
import {CoordinateFormat} from '../sharedTypes';

const m = defineMessages({
  noAnswer: {
    // Keep original id to avoid re-translation
    id: 'screens.Observation.ObservationView.noAnswer',
    defaultMessage: 'No answer',
    description:
      'Placeholder text for fields on an observation which are not answered',
  },
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

// Render the translated value of a translatable Field property (one of
// `label`, `placeholder` or `helperText`). `label` will always render
// something: if it is undefined or an empty string, then it will use the field
// key as the label. `placeholder` and `helperText` will render to null if they
// are not defined.
export const FormattedFieldProp = ({
  field,
  propName,
}: {
  field: Field;
  propName: 'label' | 'placeholder' | 'helperText';
}) => {
  const {formatMessage: t} = useIntl();
  const fieldKey = field.tagKey;
  const value = field[propName]
    ? t({
        id: `fields.${field.docId}.${propName}`,
        defaultMessage: field[propName],
      })
    : // Never show a blank label, fall back to field.key, otherwise return null
      propName === 'label'
      ? fieldKey
      : undefined;
  if (!value) return null;
  return <>{value}</>;
};

// Render a field value as a string. If the value is an array, convert to string
// and join with `, `. If the field is a select_one or select_multiple field,
// then use `field.option.label` to display the value, if a label is defined.
// Translate the field value if a translation is defined.
//
// TODO: Consider an API like
// https://formatjs.io/docs/react-intl/components#formatteddateparts to enable
// formatting of individual items in an array value.
export const FormattedFieldValue = ({
  value,
  field,
}: {
  value: any;
  field: Field;
}) => {
  const {formatMessage: t} = useIntl();
  // Select multiple answers are an array, so we join them with commas
  const formattedValues = (Array.isArray(value) ? value : [value])
    // Filter any undefined values or empty strings (an empty string can come
    // from a user deleting an answer) TODO: Values that are just spaces
    .filter(
      formattedValue =>
        typeof formattedValue !== 'undefined' && formattedValue !== '',
    )
    .map(formattedValue =>
      t({
        id: `fields.${field.docId}.options.${JSON.stringify(formattedValue)}`,
        defaultMessage: getValueLabel(formattedValue, field),
      }).trim(),
    )
    .join(', ');
  // This will return a noAnswer string if formattedValue is undefined or an
  // empty string
  return <>{formattedValues || t(m.noAnswer)}</>;
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

// Format the translated preset name, with a fallback to "Observation" if no
// preset is defined
export const FormattedPresetName = ({preset}: {preset: Preset | void}) => {
  const {formatMessage: t} = useIntl();
  const name = preset
    ? t({id: `presets.${preset.docId}.name`, defaultMessage: preset.name})
    : t(m.observation);

  return <React.Fragment>{name}</React.Fragment>;
};

// TODO: Better hangling of boolean and null values (we don't create these
// anywhere yet)
function getValueLabel(
  value: null | boolean | number | string,
  field: Field,
): string {
  if (field.type === 'selectOne' || field.type === 'selectMultiple') {
    // Look up label from field options. This is not necessary for presets
    // created with mapeo-settings-builder@^3.1.0, which will have these options
    // in the translation file, but is needed for older versions of presets
    const matchingOption = field.options?.find(
      option => option.value === value,
    );
    if (matchingOption) return matchingOption.label;
  }
  if (value === null) {
    return 'NULL';
  } else if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  } else if (typeof value === 'number') {
    return String(value);
  } else {
    return value;
  }
}
