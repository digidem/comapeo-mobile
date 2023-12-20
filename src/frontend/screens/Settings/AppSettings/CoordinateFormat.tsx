import * as React from 'react';
import {ScrollView} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {formatCoords} from '../../../lib/utils';
import {
  usePersistedSettings,
  usePersistedSettingsAction,
} from '../../../hooks/persistedState/usePersistedSettings';
import {SelectOne} from '../../../sharedComponents/SelectOne';
import {
  NativeNavigationComponent,
  CoordinateFormat as CoordinateFormatType,
} from '../../../sharedTypes';
import {useLastKnownLocation} from '../../../hooks/useLastSavedLocation';

const m = defineMessages({
  title: {
    id: 'screens.CoordinateFormat.title',
    defaultMessage: 'Coordinate Format',
    description: 'Title coordinate format screen',
  },
  dd: {
    id: 'screens.CoordinateFormat.dd',
    defaultMessage: 'Decimal Degrees (DD)',
    description: 'Decimal Degrees coordinate format',
  },
  dms: {
    id: 'screens.CoordinateFormat.dms',
    defaultMessage: 'Degrees/Minutes/Seconds (DMS)',
    description: 'Degrees/Minutes/Seconds coordinate format',
  },
  utm: {
    id: 'screens.CoordinateFormat.utm',
    defaultMessage: 'Universal Transverse Mercator (UTM)',
    description: 'Universal Transverse Mercator coordinate format',
  },
});

// Default location used to show how coordinates will be formatted. Uses current
// user location if available
const EXAMPLE_LOCATION = {longitude: -72.312023, latitude: -10.38787};

export const CoordinateFormat: NativeNavigationComponent<
  'CoordinateFormat'
> = () => {
  const {formatMessage} = useIntl();
  const coordinateFormat = usePersistedSettings(
    store => store.coordinateFormat,
  );
  const {setCoordinateFormat} = usePersistedSettingsAction();

  const location = useLastKnownLocation();

  const lat = getNestedProperty(
    location,
    'position.coords.latitude',
    EXAMPLE_LOCATION.latitude,
  );
  const lon = getNestedProperty(
    location,
    'position.coords.longitude',
    EXAMPLE_LOCATION.longitude,
  );

  const options: React.ComponentProps<
    typeof SelectOne<CoordinateFormatType>
  >['options'] = [
    {
      value: 'dd',
      label: formatMessage(m.dd),
      hint: formatCoords({lat, lon, format: 'dd'}),
    },
    {
      value: 'dms',
      label: formatMessage(m.dms),
      hint: formatCoords({lat, lon, format: 'dms'}),
    },
    {
      value: 'utm',
      label: formatMessage(m.utm),
      hint: formatCoords({lat, lon, format: 'utm'}),
    },
  ];

  return (
    <ScrollView testID="coordinateFormatScrollView">
      <SelectOne
        value={coordinateFormat}
        onChange={val => setCoordinateFormat(val)}
        options={options}
      />
    </ScrollView>
  );
};

CoordinateFormat.navTitle = m.title;

function getNestedProperty<T>(obj: T, path: string, defaultValue: any): any {
  const keys = path.split('.');
  return keys.reduce(
    (acc: any, key: string) =>
      acc && acc[key] !== undefined ? acc[key] : defaultValue,
    obj,
  );
}
