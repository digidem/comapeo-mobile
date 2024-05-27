import React, {FC, useCallback} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {StyleSheet, View} from 'react-native';
import {Text} from '../../sharedComponents/Text.tsx';
import {Button} from '../../sharedComponents/Button.tsx';
import {defineMessages, useIntl} from 'react-intl';
import ErrorIcon from '../../images/Error.svg';
import {COMAPEO_BLUE, MAGENTA, WHITE} from '../../lib/styles.ts';
import DiscardIcon from '../../images/delete.svg';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';

export interface TrackDiscardModal {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
}

const m = defineMessages({
  discardTrackTitle: {
    id: 'Modal.DiscardTrack.title',
    defaultMessage: 'Discard Track?',
  },
  discardTrackDescription: {
    id: 'Modal.DiscardTrack.description',
    defaultMessage: 'Your Track will not be saved.\n This cannot be undone.',
  },
  discardTrackDiscardButton: {
    id: 'Modal.GPSDisable.discardButton',
    defaultMessage: 'Discard Track',
  },
  discardTrackDefaultButton: {
    id: 'Modal.GPSDisable.defaultButton',
    defaultMessage: 'Continue Editing',
  },
});

export const TrackDiscardModal: FC<TrackDiscardModal> = ({bottomSheetRef}) => {
  const {formatMessage} = useIntl();
  const navigation = useNavigationFromHomeTabs();
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);
  const handleDiscard = () => {
    bottomSheetRef.current?.close();
    navigation.navigate('Home', {screen: 'Map'});
    clearCurrentTrack();
  };

  const handleContinue = () => {
    bottomSheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      style={styles.modal}
      ref={bottomSheetRef}
      enableDynamicSizing
      enableDismissOnClose
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      backdropComponent={renderBackdrop}
      handleComponent={() => null}>
      <BottomSheetView>
        <View style={styles.wrapper}>
          <ErrorIcon width={60} height={60} style={styles.image} />
          <Text style={styles.title}>{formatMessage(m.discardTrackTitle)}</Text>
          <Text style={styles.description}>
            {formatMessage(m.discardTrackDescription)}
          </Text>
          <Button
            fullWidth
            onPress={handleDiscard}
            style={styles.discardButton}>
            <View style={styles.discardButtonWrapper}>
              <DiscardIcon />
              <Text style={[styles.buttonText, styles.discardButtonText]}>
                {formatMessage(m.discardTrackDiscardButton)}
              </Text>
            </View>
          </Button>
          <Button
            fullWidth
            onPress={handleContinue}
            style={styles.defaultButton}>
            <Text style={[styles.buttonText, styles.defaultButtonText]}>
              {formatMessage(m.discardTrackDefaultButton)}
            </Text>
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export const styles = StyleSheet.create({
  modal: {borderBottomLeftRadius: 0, borderBottomRightRadius: 0},
  wrapper: {
    paddingTop: 30,
    paddingHorizontal: 40,
    paddingBottom: 20,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  image: {marginBottom: 15},
  title: {fontSize: 24, fontWeight: 'bold', textAlign: 'center'},
  description: {fontSize: 16, textAlign: 'center', marginVertical: 10},
  discardButton: {
    backgroundColor: MAGENTA,
    marginBottom: 20,
  },
  discardButtonWrapper: {
    flexDirection: 'row',
  },
  discardButtonText: {
    marginLeft: 10,
    color: WHITE,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  defaultButtonText: {
    color: COMAPEO_BLUE,
  },
  defaultButton: {
    borderWidth: 1.5,
    borderColor: '#CCCCD6',
    backgroundColor: 'transparent',
  },
});
