import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {useLastKnownLocation} from '../hooks/useLastSavedLocation';
import {GPS_MODAL_TEXT, WHITE} from '../lib/styles';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft';
import {DateDistance} from '../sharedComponents/DateDistance';
import {FormattedCoords} from '../sharedComponents/FormattedData';
import {BodyText} from '../sharedComponents/Text/BodyText';
import {HeaderText} from '../sharedComponents/Text/HeaderText';
import {useCoordinateFormat} from '../contexts/CoordinateFormatStoreContext';
import {useUnitSystem} from '../contexts/UnitSystemStoreContext';
import {useLocationState} from '../contexts/LocationContext';
import {
  metersOrConversion,
  metersPerSecondOrConversion,
} from '../lib/unitConversion';

const m = defineMessages({
  gpsHeader: {
    id: '$1screens.LocationInfoScreen.gpsHeader',
    defaultMessage: 'Current GPS Location',
    description: 'Header for GPS screen',
  },
  lastUpdate: {
    id: 'screens.LocationInfoScreen.lastUpdate',
    defaultMessage: 'Last update',
    description: 'Section title for time of last GPS update',
  },
  utm: {
    id: 'screens.LocationInfoScreen.locationUTM',
    defaultMessage: 'Coordinates UTM',
    description: 'Section title for UTM coordinates',
  },
  dms: {
    id: 'screens.LocationInfoScreen.locationDMS',
    defaultMessage: 'Coordinates DMS',
    description: 'Section title for DMS coordinates',
  },
  dd: {
    id: 'screens.LocationInfoScreen.locationDD',
    defaultMessage: 'Coordinates Decimal Degrees',
    description: 'Section title for DD coordinates',
  },
  details: {
    id: 'screens.LocationInfoScreen.details',
    defaultMessage: 'Details',
    description: 'Section title for details about current position',
  },
  yes: {
    id: '$1screens.LocationInfoScreen.yes',
    defaultMessage: 'Yes',
    description: 'if a location sensor is active yes/no',
  },
  no: {
    id: '$1screens.LocationInfoScreen.no',
    defaultMessage: 'No',
    description: 'if a location sensor is active yes/no',
  },
  locationSensors: {
    id: 'screens.LocationInfoScreen.locationSensors',
    defaultMessage: 'Sensor Status',
    description: 'Heading for section about location sensor status',
  },
});

const InfoRow = ({label, value}: {label: string; value: string}) => (
  <View style={styles.row}>
    <HeaderText variant="header5" style={styles.rowLabel}>
      {label}
    </HeaderText>
    <BodyText style={styles.rowValue}>{value}</BodyText>
  </View>
);

export const LocationInfoScreen = () => {
  const location = useLocationState(store => store.location);
  const lastKnownLocationQuery = useLastKnownLocation();
  const provider = useLocationState(store => store.providerStatus);
  const coordinateFormat = useCoordinateFormat();
  const unitSystem = useUnitSystem();
  const {formatMessage: t} = useIntl();

  const locationTimestamp =
    location?.timestamp || lastKnownLocationQuery.data?.timestamp;

  const formatCoordValue = (key: string, value: number): string => {
    if (
      key === 'accuracy' ||
      key === 'altitude' ||
      key === 'altitudeAccuracy'
    ) {
      const {value: v, unit} = metersOrConversion(value, unitSystem);
      return `${v} ${unit}`;
    }
    if (key === 'speed') {
      const {value: v, unit} = metersPerSecondOrConversion(value, unitSystem);
      return `${v} ${unit}`;
    }
    return value.toFixed(5);
  };

  return (
    <ScrollView style={styles.container} testID="MAIN.gps-details-scrn">
      <View style={styles.infoArea}>
        <HeaderText variant="header5" style={styles.sectionTitle}>
          <FormattedMessage {...m.lastUpdate} />
        </HeaderText>
        <DateDistance
          style={styles.rowValue}
          date={locationTimestamp ? new Date(locationTimestamp) : new Date()}
        />
        {location && (
          <>
            <HeaderText variant="header5" style={styles.sectionTitle}>
              <FormattedMessage {...m[coordinateFormat]} />
            </HeaderText>
            <BodyText style={styles.rowValue}>
              <FormattedCoords
                lon={location.coords.longitude}
                lat={location.coords.latitude}
                format={coordinateFormat}
              />
            </BodyText>
            <HeaderText variant="header5" style={styles.sectionTitle}>
              <FormattedMessage {...m.details} />
            </HeaderText>
            {Object.entries(location.coords).map(([key, value]) => (
              <InfoRow
                key={key}
                label={key}
                value={
                  typeof value === 'number' ? formatCoordValue(key, value) : ''
                }
              />
            ))}
          </>
        )}
        {provider && (
          <>
            <HeaderText variant="header5" style={styles.sectionTitle}>
              <FormattedMessage {...m.locationSensors} />
            </HeaderText>
            {Object.entries(provider).map(([key, value]) => (
              <InfoRow key={key} label={key} value={t(value ? m.yes : m.no)} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.gpsHeader),
      headerStyle: {backgroundColor: GPS_MODAL_TEXT},
      headerTintColor: WHITE,
      statusBarStyle: 'light',
      headerLeft: props => (
        <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
      ),
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GPS_MODAL_TEXT,
    flexDirection: 'column',
  },
  row: {flexDirection: 'row'},
  sectionTitle: {
    color: 'white',
    marginTop: 10,
    marginBottom: 5,
  },
  rowLabel: {
    color: 'white',
    minWidth: '50%',
  },
  rowValue: {
    color: 'white',
  },
  infoArea: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});
