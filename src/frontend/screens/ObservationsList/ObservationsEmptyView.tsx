import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {BLUE_GREY, WHITE} from '../../lib/styles';
import {IconTitleDescription} from '../../sharedComponents/IconTitleDescription';
import {CellphoneIcon} from '../../sharedComponents/icons';

const m = defineMessages({
  noObservationsTitle: {
    id: '$1screens.ObservationsList.ObservationsEmptyView.noObservationsTitle',
    description:
      'Title of observation list view when the user has not yet recorded observations',
    defaultMessage: 'Start mapping your world.',
  },
  noObservationsDesc: {
    id: 'screens.ObservationsList.ObservationsEmptyView.noObservationsDesc',
    description:
      'Description of observation list view when the user has not yet recorded observations',
    defaultMessage: 'All observations and tracks will be listed here.',
  },
});

const ICON_SIZE = 80;

export const ObservationEmptyView = () => {
  const {formatMessage: t} = useIntl();

  return (
    <View style={styles.container} testID="observationsEmptyView">
      <IconTitleDescription
        // Placeholder. Waiting on the real icon from design
        icon={<CellphoneIcon color={BLUE_GREY} size={ICON_SIZE} />}
        title={t(m.noObservationsTitle)}
        description={t(m.noObservationsDesc)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 60,
  },
});
