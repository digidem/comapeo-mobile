import * as React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
} from 'react-native';
import {
  FormattedMessage,
  MessageDescriptor,
  defineMessages,
  useIntl,
} from 'react-intl';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';

import {useDraftObservation} from '../../hooks/useDraftObservation';
import {
  usePersistedSettings,
  usePersistedSettingsAction,
} from '../../hooks/persistedState/usePersistedSettings';
import {BLACK} from '../../lib/styles';
import {IconButton} from '../../sharedComponents/IconButton';
import {SaveIcon} from '../../sharedComponents/icons';
import {Select} from '../../sharedComponents/Select';
import {Text} from '../../sharedComponents/Text';
import {
  type NativeRootNavigationProps,
  type CoordinateFormat,
} from '../../sharedTypes';

import {type ConvertedCoordinateData} from './shared';
import {DdForm} from './DdForm';
import {DmsForm} from './DmsForm';
import {UtmForm} from './UtmForm';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';

const m = defineMessages({
  title: {
    id: 'screens.ManualGpsScreen.title',
    defaultMessage: 'Enter coordinates',
    description: 'title of manual GPS screen',
  },
  coordinateFormat: {
    id: 'screens.ManualGpsScreen.coordinateFormat',
    defaultMessage: 'Coordinate Format',
  },
  decimalDegrees: {
    id: 'screens.ManualGpsScreen.decimalDegrees',
    defaultMessage: 'Decimal Degrees (DD)',
  },
  degreesMinutesSeconds: {
    id: 'screens.ManualGpsScreen.degreesMinutesSeconds',
    defaultMessage: 'Degrees/Minutes/Seconds (DMS)',
  },
  universalTransverseMercator: {
    id: 'screens.ManualGpsScreen.universalTransverseMercator',
    defaultMessage: 'Universal Transverse Mercator (UTM)',
  },
});

export const ManualGpsScreen = ({
  navigation,
}: NativeRootNavigationProps<'ManualGpsScreen'>) => {
  const {formatMessage: t} = useIntl();

  const [convertedData, setConvertedData] =
    React.useState<ConvertedCoordinateData>({});

  const ENTRY_FORMAT_OPTIONS = React.useMemo(
    () => [
      {label: t(m.decimalDegrees), value: 'dd'},
      {label: t(m.degreesMinutesSeconds), value: 'dms'},
      {label: t(m.universalTransverseMercator), value: 'utm'},
    ],
    [t],
  );

  const observationValue = usePersistedDraftObservation(
    observationValueSelector,
  );

  const entryCoordinateFormat = usePersistedSettings(
    entryCoordinateFormatSelector,
  );

  const {setManualCoordinateEntryFormat} = usePersistedSettingsAction();
  const {updateObservationPosition} = useDraftObservation();

  React.useEffect(() => {
    function handleSavePress() {
      if (convertedData.error) {
        return ToastAndroid.showWithGravity(
          convertedData.error.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      }

      updateObservationPosition({
        position: {
          mocked: false,
          coords: {
            latitude: convertedData.coords?.lat,
            longitude: convertedData.coords?.lon,
          },
        },
        manualLocation: true,
      });

      navigation.pop();
    }

    navigation.setOptions({
      headerRight: () => (
        <IconButton onPress={handleSavePress}>
          <SaveIcon inprogress={false} />
        </IconButton>
      ),
    });
  }, [navigation, convertedData, updateObservationPosition]);

  const locationCoordinates =
    observationValue &&
    observationValue.lat !== undefined &&
    observationValue.lon !== undefined
      ? {
          lat: observationValue.lat,
          lon: observationValue.lon,
        }
      : undefined;

  return (
    <View>
      {/* TODO: Set `behavior` to "padding" when iOS is supported */}
      <KeyboardAvoidingView>
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <View style={styles.formatSelect}>
            <Text style={styles.inputLabel}>
              <FormattedMessage {...m.coordinateFormat} />
            </Text>
            <Select
              containerStyles={styles.selectContainer}
              onChange={value => {
                if (!isCoordinateFormat(value)) {
                  return;
                }

                setManualCoordinateEntryFormat(value);
              }}
              options={ENTRY_FORMAT_OPTIONS}
              selectedValue={entryCoordinateFormat}
            />
          </View>

          <View style={styles.formContainer}>
            {entryCoordinateFormat === 'dd' ? (
              <DdForm
                initialCoordinates={locationCoordinates}
                onValueUpdate={setConvertedData}
              />
            ) : entryCoordinateFormat === 'dms' ? (
              <DmsForm
                initialCoordinates={locationCoordinates}
                onValueUpdate={setConvertedData}
              />
            ) : (
              <UtmForm
                initialCoordinates={locationCoordinates}
                onValueUpdate={setConvertedData}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export function createNavigationOptions({
  intl,
}: {
  intl: (title: MessageDescriptor) => string;
}) {
  return (): NativeStackNavigationOptions => {
    return {
      headerTitle: intl(m.title),
      headerRight: () => (
        <IconButton>
          <SaveIcon inprogress={false} />
        </IconButton>
      ),
    };
  };
}

function entryCoordinateFormatSelector(
  state: Parameters<Parameters<typeof usePersistedSettings>[0]>[0],
) {
  return state.manualCoordinateEntryFormat;
}

function observationValueSelector(
  state: Parameters<Parameters<typeof usePersistedDraftObservation>[0]>[0],
) {
  return state.value;
}

function isCoordinateFormat(value: string): value is CoordinateFormat {
  return value === 'dd' || value === 'dms' || value === 'utm';
}

const styles = StyleSheet.create({
  scrollContentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  selectContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontWeight: 'bold',
    color: BLACK,
  },
  formatSelect: {
    marginHorizontal: 10,
  },
  formContainer: {
    marginVertical: 20,
  },
});
