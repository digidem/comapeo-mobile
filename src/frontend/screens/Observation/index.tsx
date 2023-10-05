import React from 'react';
import {Alert} from 'react-native';
import {Text} from '../../sharedComponents/Text';
import {defineMessages, FormattedMessage} from 'react-intl';

import {CenteredView} from '../../sharedComponents/CenteredView';
import ObservationHeaderRight from './ObservationHeaderRight';
import {NativeNavigationComponent} from '../../sharedTypes';
import {Loading} from '../../sharedComponents/Loading';
import {ObservationView} from './ObservationView';
import {useObservation} from '../../hooks/useObservation';
import {usePresetsQuery} from '../../hooks/server/usePresetsQuery';
import {useFieldsQuery} from '../../hooks/server/useFieldsQuery';

const m = defineMessages({
  notFound: {
    id: 'screens.Observation.notFound',
    defaultMessage: 'Observation not found',
    description: 'Message shown when an observation is not found',
  },
  title: {
    id: 'screens.Observation.title',
    defaultMessage: 'Observation',
    description:
      'Title of observation screen showing (non-editable) view of observation with map and answered questions',
  },
});

// TODO: Add a better message for the user.
// In the future if we add deep-linking we could get here,
// otherwise we should never reach here unless there is a bug in the code
const ObservationNotFound = () => (
  <CenteredView>
    <Text>
      <FormattedMessage {...m.notFound} />
    </Text>
  </CenteredView>
);

const Observation: NativeNavigationComponent<'Observation'> = ({
  route,
  navigation,
}) => {
  const {observationId} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <ObservationHeaderRight observationId={observationId} />
      ),
    });
  }, [navigation, observationId]);

  const observation = useObservation(observationId);

  if (!observation) return <ObservationNotFound />;

  return <ObservationView observation={observation} />;
};

Observation.navTitle = m.title;

export default Observation;
