import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ScrollView} from 'react-native';

import {
  useUnitSystem,
  useUnitSystemActions,
} from '../../contexts/UnitSystemStoreContext';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '../../sharedComponents/List';
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

  const isMetric = unitSystem === 'metric';
  const isImperial = unitSystem === 'imperial';

  return (
    <ScrollView
      testID="unitSystemScreen"
      contentContainerStyle={{paddingTop: 25}}>
      <List>
        <ListItem
          testID={isMetric ? 'metricButton-selected' : 'metricButton'}
          onPress={() => !isMetric && setUnitSystem('metric')}>
          <ListItemIcon
            iconName={
              isMetric ? 'radio-button-checked' : 'radio-button-unchecked'
            }
          />
          <ListItemText primary={t(m.metric)} secondary={t(m.metricSubtitle)} />
        </ListItem>
        <ListItem
          testID={isImperial ? 'imperialButton-selected' : 'imperialButton'}
          onPress={() => !isImperial && setUnitSystem('imperial')}>
          <ListItemIcon
            iconName={
              isImperial ? 'radio-button-checked' : 'radio-button-unchecked'
            }
          />
          <ListItemText
            primary={t(m.imperial)}
            secondary={t(m.imperialSubtitle)}
          />
        </ListItem>
      </List>
    </ScrollView>
  );
};

UnitSystemSettings.navTitle = m.title;
