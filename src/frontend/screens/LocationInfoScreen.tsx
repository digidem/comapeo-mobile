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
import {useLocationProviderStatus} from '../hooks/useLocationProviderStatus';
import {usePersistedSettings} from '../hooks/persistedState/usePersistedSettings';
import {GPS_MODAL_TEXT, WHITE} from '../lib/styles';
import {CustomHeaderLeft} from '../sharedComponents/CustomHeaderLeft';
import {DateDistance} from '../sharedComponents/DateDistance';
import {FormattedCoords} from '../sharedComponents/FormattedData';
import {Text} from '../sharedComponents/Text';
import {useLocation} from '../hooks/useLocation';

const m = defineMessages({
  gpsHeader: {
    id: 'screens.LocationInfoScreen.gpsHeader',
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
    id: 'screens.LocationInfoScreen.yes',
    defaultMessage: 'Yes',
    description: 'if a location sensor is active yes/no',
  },
  no: {
    id: 'screens.LocationInfoScreen.no',
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
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

export const LocationInfoScreen = () => {
  const {location} = useLocation();
  const lastKnownLocationQuery = useLastKnownLocation();
  const provider = useLocationProviderStatus();
  const {coordinateFormat} = usePersistedSettings();
  const {formatMessage: t} = useIntl();

  const locationTimestamp =
    location?.timestamp || lastKnownLocationQuery.data?.timestamp;

  return (
    <ScrollView style={styles.container} testID="gpsScreenScrollView">
      <View style={styles.infoArea}>
        <Text style={styles.sectionTitle}>
          <FormattedMessage {...m.lastUpdate} />
        </Text>
        <DateDistance
          style={styles.rowValue}
          date={locationTimestamp ? new Date(locationTimestamp) : new Date()}
        />
        {location && (
          <>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m[coordinateFormat]} />
            </Text>
            <Text style={styles.rowValue}>
              <FormattedCoords
                lon={location.coords.longitude}
                lat={location.coords.latitude}
                format={coordinateFormat}
              />
            </Text>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m.details} />
            </Text>
            {Object.entries(location.coords).map(([key, value]) => (
              <InfoRow
                key={key}
                label={key}
                value={typeof value === 'number' ? value.toFixed(5) : ''}
              />
            ))}
          </>
        )}
        {provider && (
          <>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m.locationSensors} />
            </Text>
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
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  rowLabel: {
    color: 'white',
    fontWeight: '700',
    minWidth: '50%',
  },
  rowValue: {
    color: 'white',
    fontWeight: '400',
  },
  infoArea: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});
