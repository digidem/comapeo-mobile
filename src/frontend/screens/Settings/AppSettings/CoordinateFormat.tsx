import * as React from 'react';
import {ScrollView} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import {SelectOne} from '../../../sharedComponents/SelectOne';
import type {NativeNavigationComponent} from '../../../sharedTypes/navigation';
import {useLastKnownLocation} from '../../../hooks/useLastSavedLocation';
import {
  formatCoords,
  type CoordinateFormat as CoordinateFormatType,
} from '../../../lib/coordinateFormat';
import {useCoordinateFormat} from '../../../hooks/resolvedSettings/useCoordinateFormat';
import {useSettingsActions} from '../../../contexts/SettingsStoreContext';

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
  const coordinateFormat = useCoordinateFormat();
  const {setCoordinateFormat} = useSettingsActions();

  const location = useLastKnownLocation();

  const lat = location.data?.coords.latitude || EXAMPLE_LOCATION.latitude;
  const lon = location.data?.coords.longitude || EXAMPLE_LOCATION.longitude;

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
