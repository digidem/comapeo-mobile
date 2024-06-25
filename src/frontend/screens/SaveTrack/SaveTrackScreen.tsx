import React, {useCallback} from 'react';
import {
  BackHandler,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {BottomSheet} from '../../sharedComponents/BottomSheet';
import PhotoIcon from '../../images/camera.svg';
import DetailsIcon from '../../images/details.svg';
import TrackIcon from '../../images/Track.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text';
import {TrackDescriptionField} from './TrackDescriptionField';
import {
  BottomSheetModalContent,
  BottomSheetModal,
  useBottomSheetModal,
} from '../../sharedComponents/BottomSheetModal';
import DiscardIcon from '../../images/delete.svg';
import ErrorIcon from '../../images/Error.svg';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {SaveTrackButton} from './SaveTrackButton';
import Close from '../../images/close.svg';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromRoot();
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);
  const {formatMessage: t} = useIntl();
  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  const handleCameraPress = React.useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const bottomSheetItems = [
    {
      icon: <PhotoIcon />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
    {
      icon: <DetailsIcon />,
      label: t(m.detailsButton),
      onPress: () => {},
    },
  ];

  const handleDiscard = () => {
    closeSheet();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Home', params: {screen: 'Map'}}],
      }),
    );
    clearCurrentTrack();
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable hitSlop={10} onPress={openSheet} style={{marginRight: 20}}>
            <Close />
          </Pressable>
        ),
        headerRight: () => <SaveTrackButton />,
      });
    }, [navigation, openSheet]),
  );

  // disables back button
  useFocusEffect(
    useCallback(() => {
      const disableBack = () => {
        openSheet();
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          disableBack();
          return true;
        },
      );

      return () => subscription.remove();
    }, [openSheet]),
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.titleWrapper}>
            <TrackIcon style={styles.icon} />
            <Text style={styles.titleText}>{t(m.newTitle)}</Text>
          </View>
          <TrackDescriptionField />
        </ScrollView>
        <BottomSheet items={bottomSheetItems} />
      </SafeAreaView>
      <BottomSheetModal ref={sheetRef} isOpen={isOpen}>
        <BottomSheetModalContent
          buttonConfigs={[
            {
              variation: 'filled',
              dangerous: true,
              onPress: handleDiscard,
              text: t(m.discardTrackDiscardButton),
              icon: <DiscardIcon />,
            },
            {
              onPress: closeSheet,
              text: t(m.discardTrackDefaultButton),
              variation: 'outlined',
            },
          ]}
          title={t(m.discardTrackTitle)}
          description={t(m.discardTrackDescription)}
          icon={<ErrorIcon width={60} height={60} />}
        />
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  icon: {width: 30, height: 30},
  titleText: {fontSize: 20, fontWeight: '700'},
  container: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
  titleWrapper: {
    padding: 10,
    marginTop: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EDEDED',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    alignContent: 'stretch',
  },
});

export const m = defineMessages({
  trackEditScreenTitle: {
    id: 'screens.SaveTrack.TrackEditView.title',
    defaultMessage: 'New Track',
    description: 'Title for new track screen',
  },
  newTitle: {
    id: 'screens.SaveTrack.track',
    defaultMessage: 'Track',
    description: 'Category title for new track screen',
  },
  detailsButton: {
    id: 'screens.SaveTrack.TrackEditView.saveTrackDetails',
    defaultMessage: 'Details',
    description: 'Button label for check details',
  },
  photoButton: {
    id: 'screens.SaveTrack.TrackEditView.saveTrackCamera',
    defaultMessage: 'Camera',
    description: 'Button label for adding photo',
  },
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
