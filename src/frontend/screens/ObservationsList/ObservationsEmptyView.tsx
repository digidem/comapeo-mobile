import {defineMessages, useIntl} from 'react-intl';
import {StyleSheet, View} from 'react-native';

import {WHITE} from '../../lib/styles';
import {Button} from '../../sharedComponents/Button';
import {ObservationListIcon} from '../../sharedComponents/icons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';

const m = defineMessages({
  noObservationsTitle: {
    id: 'screens.ObservationsList.ObservationsEmptyView.noObservationsTitle',
    description:
      'Title of observation list view when the user has not yet recorded observations',
    defaultMessage: 'Add Observations',
  },
  noObservationsDesc: {
    id: 'screens.ObservationsList.ObservationsEmptyView.noObservationsDesc',
    description:
      'Description of observation list view when the user has not yet recorded observations',
    defaultMessage:
      'Start from map or camera view to record your first observation.',
  },
  backButton: {
    id: 'screens.ObservationsList.ObservationsEmptyView.backButton',
    description:
      'Back button on observation list screen when no observations are yet recorded',
    defaultMessage: 'Go To Map',
  },
});

const ICON_SIZE = 48;

export const ObservationEmptyView = ({
  onPressBack,
}: {
  onPressBack: () => void;
}) => {
  const {formatMessage: t} = useIntl();
  return (
    <ScreenContentWithDock
      testID="observationsEmptyView"
      contentContainerStyle={styles.contentContainer}
      dockContainerStyle={styles.dockContainer}
      dockContent={
        <Button
          fullWidth
          onPress={onPressBack}
          variant="outlined"
          color="ComapeoBlue">
          {t(m.backButton)}
        </Button>
      }>
      <View style={styles.iconCircle}>
        <ObservationListIcon size={ICON_SIZE} />
      </View>
      <HeaderText variant="header2" style={styles.text}>
        {t(m.noObservationsTitle)}
      </HeaderText>
      <BodyText style={styles.text}>{t(m.noObservationsDesc)}</BodyText>
    </ScreenContentWithDock>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    backgroundColor: WHITE,
    flex: 1,
    gap: 20,
    padding: 48,
  },
  dockContainer: {
    backgroundColor: WHITE,
    paddingHorizontal: 48,
  },
  iconCircle: {
    alignItems: 'center',
    backgroundColor: '#CCE0FF',
    borderRadius: ICON_SIZE,
    height: ICON_SIZE * 2,
    justifyContent: 'center',
    width: ICON_SIZE * 2,
  },
  text: {
    textAlign: 'center',
  },
});
