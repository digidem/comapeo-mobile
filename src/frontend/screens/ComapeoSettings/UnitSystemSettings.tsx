import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView} from 'react-native';

import {
  useUnitSystem,
  useUnitSystemActions,
} from '../../contexts/UnitSystemStoreContext';
import {SelectOne} from '../../sharedComponents/SelectOne';
import {type NativeNavigationComponent} from '../../sharedTypes/navigation';

const m = defineMessages({
  title: {
    id: '$1screens.UnitSystemSettings.title',
    defaultMessage: 'Unit System',
    description: 'Title for unit system settings screen',
  },
  metric: {
    id: '$1screens.UnitSystemSettings.metric',
    defaultMessage: 'Metric',
    description: 'Label for metric unit system option',
  },
  metricSubtitle: {
    id: '$1screens.UnitSystemSettings.metricSubtitle',
    defaultMessage: 'Display Information (km, m)',
  },
  imperial: {
    id: '$1screens.UnitSystemSettings.imperial',
    defaultMessage: 'Imperial',
    description: 'Label for imperial unit system option',
  },
  imperialSubtitle: {
    id: '$1screens.UnitSystemSettings.imperialSubtitle',
    defaultMessage: 'Display Information (ft, mi)',
  },
});

export const UnitSystemSettings: NativeNavigationComponent<
  'UnitSystemSettings'
> = () => {
  const {formatMessage: t} = useIntl();
  const unitSystem = useUnitSystem();
  const {setUnitSystem} = useUnitSystemActions();

  const options = [
    {
      value: 'metric' as const,
      label: t(m.metric),
      hint: t(m.metricSubtitle),
    },
    {
      value: 'imperial' as const,
      label: t(m.imperial),
      hint: t(m.imperialSubtitle),
    },
  ];

  return (
    <ScrollView
      testID="unitSystemScreen"
      contentContainerStyle={{paddingTop: 25}}>
      <SelectOne
        value={unitSystem}
        options={options}
        onChange={selected => {
          setUnitSystem(selected);
        }}
      />
    </ScrollView>
  );
};

UnitSystemSettings.navTitle = m.title;
