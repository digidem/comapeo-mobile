import * as React from 'react';
import {View} from 'react-native';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {convertDmsToDd} from '../../../lib/utils';
import {
  CoordinateField,
  FormProps,
  getInitialCardinality,
  parseNumber,
} from '../shared';
import {DmsInputGroup} from './DmsInputGroup';

const INITIAL_UNIT_VALUES = {
  degrees: '',
  minutes: '',
  seconds: '',
};

export type DmsData = {
  degrees: string;
  minutes: string;
  seconds: string;
};

export type DmsUnit = keyof DmsData;

const m = defineMessages({
  invalidCoordinates: {
    id: 'screens.ManualGpsScreen.DmsForm.invalidCoordinates',
    defaultMessage: 'Invalid coordinates',
  },
  latitude: {
    id: 'screens.ManualGpsScreen.DmsForm.latitude',
    defaultMessage: 'Latitude',
  },
  longitude: {
    id: 'screens.ManualGpsScreen.DmsForm.longitude',
    defaultMessage: 'Longitude',
  },
  north: {
    id: 'screens.ManualGpsScreen.DmsForm.north',
    defaultMessage: 'North',
  },
  south: {
    id: 'screens.ManualGpsScreen.DmsForm.south',
    defaultMessage: 'South',
  },
  east: {
    id: 'screens.ManualGpsScreen.DmsForm.east',
    defaultMessage: 'East',
  },
  west: {
    id: 'screens.ManualGpsScreen.DmsForm.west',
    defaultMessage: 'West',
  },
  selectLatCardinality: {
    id: 'screens.ManualGpsScreen.DmsForm.selectLatCardinality',
    defaultMessage: 'Select latitude cardinality',
  },
  selectLonCardinality: {
    id: 'screens.ManualGpsScreen.DdForm.selectLonCardinality',
    defaultMessage: 'Select longitude cardinality',
  },
});

export const DmsForm = ({initialCoordinates, onValueUpdate}: FormProps) => {
  const {formatMessage: t} = useIntl();

  const DIRECTION_OPTIONS_NORTH_SOUTH = React.useMemo(
    () => [
      {
        value: 'N',
        label: t(m.north),
      },
      {
        value: 'S',
        label: t(m.south),
      },
    ],
    [t],
  );

  const DIRECTION_OPTIONS_EAST_WEST = React.useMemo(
    () => [
      {
        value: 'E',
        label: t(m.east),
      },
      {
        value: 'W',
        label: t(m.west),
      },
    ],
    [t],
  );

  const [latitude, setLatitude] = React.useState<DmsData>(INITIAL_UNIT_VALUES);
  const [longitude, setLongitude] =
    React.useState<DmsData>(INITIAL_UNIT_VALUES);

  const [latCardinality, setLatCardinality] = React.useState(() =>
    getInitialCardinality('lat', initialCoordinates),
  );
  const [lonCardinality, setLonCardinality] = React.useState(() =>
    getInitialCardinality('lon', initialCoordinates),
  );

  const updateCoordinate =
    (field: CoordinateField) => (unit: DmsUnit, value: string) => {
      const update = field === 'lat' ? setLatitude : setLongitude;
      update(previous => ({...previous, [unit]: value}));
    };

  const updateCardinality = (field: CoordinateField) => (value: string) =>
    field === 'lat' ? setLatCardinality(value) : setLonCardinality(value);

  React.useEffect(() => {
    try {
      if (
        dmsValuesAreValid('lat', latitude) &&
        dmsValuesAreValid('lon', longitude)
      ) {
        const parsedDmsLat = getParsedDmsValues(latitude);
        const parsedDmsLon = getParsedDmsValues(longitude);

        if (parsedDmsLat && parsedDmsLon) {
          onValueUpdate({
            coords: {
              lat:
                convertDmsToDd(parsedDmsLat) *
                (latCardinality === 'N' ? 1 : -1),
              lon:
                convertDmsToDd(parsedDmsLon) *
                (lonCardinality === 'E' ? 1 : -1),
            },
          });
        }
      } else {
        throw new Error(t(m.invalidCoordinates));
      }
    } catch (err) {
      if (err instanceof Error) {
        onValueUpdate({
          error: err,
        });
      }
    }
  }, [t, latitude, longitude, latCardinality, lonCardinality, onValueUpdate]);

  return (
    <View>
      <DmsInputGroup
        cardinalityOptions={DIRECTION_OPTIONS_NORTH_SOUTH}
        coordinate={latitude}
        inputAccessibilityLabelPrefix={t(m.latitude)}
        label={<FormattedMessage {...m.latitude} />}
        selectCardinaltiyAccessibilityLabel={t(m.selectLatCardinality)}
        selectedCardinality={latCardinality}
        selectTestID="DmsInputGroup-lat-select"
        updateCardinality={updateCardinality('lat')}
        updateCoordinate={updateCoordinate('lat')}
      />

      <DmsInputGroup
        cardinalityOptions={DIRECTION_OPTIONS_EAST_WEST}
        coordinate={longitude}
        inputAccessibilityLabelPrefix={t(m.longitude)}
        label={<FormattedMessage {...m.longitude} />}
        selectCardinaltiyAccessibilityLabel={t(m.selectLonCardinality)}
        selectedCardinality={lonCardinality}
        selectTestID="DmsInputGroup-lon-select"
        updateCardinality={updateCardinality('lon')}
        updateCoordinate={updateCoordinate('lon')}
      />
    </View>
  );
};

export function getParsedDmsValues({degrees, minutes, seconds}: DmsData) {
  const degreesParsed = parseNumber(degrees);
  const minutesParsed = parseNumber(minutes);
  const secondsParsed = parseNumber(seconds);

  if (
    degreesParsed !== undefined &&
    minutesParsed !== undefined &&
    secondsParsed !== undefined
  ) {
    return {
      degrees: degreesParsed,
      minutes: minutesParsed,
      seconds: secondsParsed,
    };
  }
}

export function dmsValuesAreValid(field: CoordinateField, coordinate: DmsData) {
  const parsedDms = getParsedDmsValues(coordinate);

  if (parsedDms) {
    const {degrees, minutes, seconds} = parsedDms;

    if (degrees < 0 || minutes < 0 || seconds < 0) return false;

    const degreeMaximum = field === 'lat' ? 90 : 180;

    return degrees <= degreeMaximum && minutes < 60 && seconds < 60;
  } else {
    return false;
  }
}
