import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';

import ErrorIcon from '../../images/Error.svg';
import DiscardIcon from '../../images/delete.svg';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  DestructiveButton,
  SecondaryButton,
} from '../../sharedComponents/Buttons';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {useDraftObservationActions} from '../../contexts/DraftObservationContext';

const m = defineMessages({
  discardTitle: {
    id: 'AppContainer.EditHeader.discardTitle',
    defaultMessage: 'Discard observation?',
    description: 'Title of dialog that shows when cancelling a new observation',
  },
  discardObservationDescription: {
    id: 'AppContainer.EditHeader.discardObservationDescription',
    defaultMessage:
      'Your Observation will not be saved. This cannot be undone.',
  },
  discardCancel: {
    id: 'AppContainer.EditHeader.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardObservationButton: {
    id: 'AppContainer.EditHeader.discardObservationButton',
    defaultMessage: 'Discard Observation',
    description: 'Title of dialog that shows when cancelling observation edits',
  },
});

export const ConfirmDiscardObservationBottomSheet = () => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {clearDraft} = useDraftObservationActions();

  function handleDiscard() {
    clearDraft();
    navigation.popTo('Home', {screen: 'Map'});
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          <ErrorIcon width={80} height={80} />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.discardTitle)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.discardObservationDescription)}
        </BodyText>

        <View style={styles.buttonsContainer}>
          <DestructiveButton
            fullSize
            text={t(m.discardObservationButton)}
            renderIcon={() => <DiscardIcon />}
            onPress={handleDiscard}
          />
          <SecondaryButton
            fullSize
            text={t(m.discardCancel)}
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  icon: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  buttonsContainer: {
    gap: 16,
    alignItems: 'center',
  },
});
