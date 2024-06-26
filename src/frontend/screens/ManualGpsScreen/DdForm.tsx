import * as React from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from 'react-native';
import {FormattedMessage, defineMessages, useIntl} from 'react-intl';

import {Text} from '../../sharedComponents/Text';
import {Select} from '../../sharedComponents/Select';
import {BLACK, LIGHT_GREY} from '../../lib/styles';
import {
  POSITIVE_DECIMAL_REGEX,
  FormProps,
  getInitialCardinality,
  parseNumber,
  longitudeIsValid,
  latitudeIsValid,
} from './shared';

const MAX_COORDINATE_INPUT_LENGTH = 11;

const m = defineMessages({
  invalidCoordinates: {
    id: 'screens.ManualGpsScreen.DdForm.invalidCoordinates',
    defaultMessage: 'Invalid coordinates',
  },
  latitude: {
    id: 'screens.ManualGpsScreen.DdForm.latitude',
    defaultMessage: 'Latitude',
  },
  longitude: {
    id: 'screens.ManualGpsScreen.DdForm.longitude',
    defaultMessage: 'Longitude',
  },
  north: {
    id: 'screens.ManualGpsScreen.DdForm.north',
    defaultMessage: 'North',
  },
  south: {
    id: 'screens.ManualGpsScreen.DdForm.south',
    defaultMessage: 'South',
  },
  east: {
    id: 'screens.ManualGpsScreen.DdForm.east',
    defaultMessage: 'East',
  },
  west: {
    id: 'screens.ManualGpsScreen.DdForm.west',
    defaultMessage: 'West',
  },
  latInputLabel: {
    id: 'screens.ManualGpsScreen.DdForm.latInputLabel',
    defaultMessage: 'Latitude value',
  },
  lonInputLabel: {
    id: 'screens.ManualGpsScreen.DdForm.lonInputLabel',
    defaultMessage: 'Longitude value',
  },
  selectLatCardinality: {
    id: 'screens.ManualGpsScreen.DdForm.selectLatCardinality',
    defaultMessage: 'Select latitude cardinality',
  },
  selectLonCardinality: {
    id: 'screens.ManualGpsScreen.DdForm.selectLonCardinality',
    defaultMessage: 'Select longitude cardinality',
  },
});

export const DdForm = ({initialCoordinates, onValueUpdate}: FormProps) => {
  const {formatMessage: t} = useIntl();

  const DIRECTION_OPTIONS_NORTH_SOUTH = [
    {
      value: 'N',
      label: t(m.north),
    },
    {
      value: 'S',
      label: t(m.south),
    },
  ];

  const DIRECTION_OPTIONS_EAST_WEST = [
    {
      value: 'E',
      label: t(m.east),
    },
    {
      value: 'W',
      label: t(m.west),
    },
  ];

  const [latitudeDegrees, setLatitudeDegrees] = React.useState<string>('');
  const [longitudeDegrees, setLongitudeDegrees] = React.useState<string>('');

  const [selectedLatCardinality, setSelectedLatCardinality] = React.useState(
    () => getInitialCardinality('lat', initialCoordinates),
  );
  const [selectedLonCardinality, setSelectedLonCardinality] = React.useState(
    () => getInitialCardinality('lon', initialCoordinates),
  );

  const parsedLat = parseNumber(latitudeDegrees);
  const parsedLon = parseNumber(longitudeDegrees);

  const signedLat =
    parsedLat !== undefined
      ? parsedLat * (selectedLatCardinality === 'N' ? 1 : -1)
      : undefined;
  const signedLon =
    parsedLon !== undefined
      ? parsedLon * (selectedLonCardinality === 'E' ? 1 : -1)
      : undefined;

  React.useEffect(() => {
    try {
      const latIsValidRange =
        signedLat !== undefined && latitudeIsValid(signedLat);
      const lonIsValidRange =
        signedLon !== undefined && longitudeIsValid(signedLon);

      if (latIsValidRange && lonIsValidRange) {
        onValueUpdate({
          coords: {
            lat: signedLat,
            lon: signedLon,
          },
        });
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
  }, [t, signedLat, signedLon, onValueUpdate]);

  const validateOnChange =
    (setState: (v: string) => void) => (text: string) => {
      const isJustDecimal = text === '.';
      const endsWithDecimal = text.endsWith('.');

      if (
        text.length === 0 ||
        isJustDecimal ||
        endsWithDecimal ||
        POSITIVE_DECIMAL_REGEX.test(text)
      ) {
        setState(text);
      } else if (Number.parseFloat(text) === 0) {
        setState('0');
      }
    };

  const formatInputValue =
    (setState: (v: string) => void) =>
    ({
      nativeEvent: {text},
    }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
      const parsed = Number.parseFloat(text);
      if (!Number.isNaN(parsed)) {
        setState(parsed.toString());
      }
    };

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.latitude} />
          </Text>
          <TextInput
            accessibilityLabel={t(m.latInputLabel)}
            keyboardType="decimal-pad"
            maxLength={MAX_COORDINATE_INPUT_LENGTH}
            onChangeText={validateOnChange(setLatitudeDegrees)}
            onEndEditing={formatInputValue(setLatitudeDegrees)}
            placeholder="0.00"
            placeholderTextColor="silver"
            style={styles.input}
            underlineColorAndroid="transparent"
            value={latitudeDegrees}
          />
        </View>
        <View style={styles.column}>
          <Select
            containerStyles={styles.select}
            label={t(m.selectLatCardinality)}
            mode="dropdown"
            onChange={setSelectedLatCardinality}
            options={DIRECTION_OPTIONS_NORTH_SOUTH}
            selectedValue={selectedLatCardinality}
            testID="DdForm-lat-select"
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.longitude} />
          </Text>
          <TextInput
            accessibilityLabel={t(m.lonInputLabel)}
            keyboardType="decimal-pad"
            maxLength={MAX_COORDINATE_INPUT_LENGTH}
            onChangeText={validateOnChange(setLongitudeDegrees)}
            onEndEditing={formatInputValue(setLongitudeDegrees)}
            placeholder="0.00"
            placeholderTextColor="silver"
            style={styles.input}
            underlineColorAndroid="transparent"
            value={longitudeDegrees}
          />
        </View>
        <View style={styles.column}>
          <Select
            containerStyles={styles.select}
            label={t(m.selectLonCardinality)}
            mode="dropdown"
            onChange={setSelectedLonCardinality}
            options={DIRECTION_OPTIONS_EAST_WEST}
            selectedValue={selectedLonCardinality}
            testID="DdForm-lon-select"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    fontWeight: 'bold',
    color: BLACK,
  },
  input: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    marginTop: 10,
  },
  row: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    width: '50%',
  },
  select: {
    marginTop: 10,
  },
});
