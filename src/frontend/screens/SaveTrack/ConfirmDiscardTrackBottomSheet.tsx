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
import {useTrackActions} from '../../contexts/TrackStoreContext';

// primary-string ENTIRE
const m = defineMessages({
  discardTitle: {
    id: 'SaveTrack.HeaderLeft.discardTitle',
    defaultMessage: 'Discard Track?',
    description: 'Title of dialog that shows when cancelling track edits',
  },
  discardTrackDescription: {
    id: 'SaveTrack.HeaderLeft.discardTrackDescription',
    defaultMessage: 'Your Track will not be saved. This cannot be undone.',
  },
  discardCancel: {
    id: 'SaveTrack.HeaderLeft.discardCancel',
    defaultMessage: 'Continue editing',
    description: 'Button on dialog to keep editing (cancelling close action)',
  },
  discardTrackButton: {
    id: 'SaveTrack.HeaderLeft.discardTrackButton',
    defaultMessage: 'Discard Track',
    description: 'Button to confirm discarding the track',
  },
});

export const ConfirmDiscardTrackBottomSheet = () => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const {clearCurrentTrack} = useTrackActions();

  function handleDiscard() {
    clearCurrentTrack();
    navigation.popTo('Home', {screen: 'Map'});
  }

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={styles.icon}>
          <ErrorIcon width={60} height={60} />
        </View>

        <HeaderText variant="header2" style={styles.title}>
          {t(m.discardTitle)}
        </HeaderText>

        <BodyText variant="large" style={styles.description}>
          {t(m.discardTrackDescription)}
        </BodyText>

        <View style={styles.buttonsContainer}>
          <DestructiveButton
            fullSize
            text={t(m.discardTrackButton)}
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
