import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {SaveTrackHeader} from './saveTrack/SaveTrackHeader';
import {DiscardModal} from '../../../sharedComponents/DiscardModal.tsx';
import {BottomSheet} from '../../../sharedComponents/BottomSheet/BottomSheet';
import PhotoIcon from '../../../images/camera.svg';
import DetailsIcon from '../../../images/details.svg';
import TrackIcon from '../../../images/Track.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {TrackDescriptionField} from './saveTrack/TrackDescriptionField';
import {useBottomSheetModal} from '../../../sharedComponents/BottomSheetModal';
import DiscardIcon from '../../../images/delete.svg';
import ErrorIcon from '../../../images/Error.svg';
import {TabName} from '../../../Navigation/types.ts';
import {useCurrentTrackStore} from '../../../hooks/tracks/useCurrentTrackStore.ts';
import {useNavigationFromHomeTabs} from '../../../hooks/useNavigationWithTypes.ts';

export const SaveTrackScreen = () => {
  const navigation = useNavigationFromHomeTabs();
  const clearCurrentTrack = useCurrentTrackStore(
    state => state.clearCurrentTrack,
  );
  const {formatMessage: t} = useIntl();
  const [description, setDescription] = useState('');
  const {sheetRef, isOpen, openSheet} = useBottomSheetModal({
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
    sheetRef.current?.close();
    navigation.navigate(TabName.Map);
    clearCurrentTrack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SaveTrackHeader openSheet={openSheet} description={description} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleWrapper}>
          <TrackIcon style={styles.icon} />
          <Text style={styles.titleText}>{t(m.newTitle)}</Text>
        </View>
        <TrackDescriptionField
          description={description}
          setDescription={setDescription}
        />
        <DiscardModal
          bottomSheetRef={sheetRef}
          isOpen={isOpen}
          buttonConfigs={[
            {
              variation: 'filled',
              dangerous: true,
              onPress: handleDiscard,
              text: t(m.discardTrackDiscardButton),
              icon: <DiscardIcon />,
            },
            {
              onPress: () => sheetRef.current?.close(),
              text: t(m.discardTrackDefaultButton),
              variation: 'outlined',
            },
          ]}
          title={t(m.discardTrackTitle)}
          description={t(m.discardTrackDescription)}
          icon={<ErrorIcon width={60} height={60} style={styles.image} />}
        />
      </ScrollView>
      <BottomSheet items={bottomSheetItems} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {width: 30, height: 30},
  image: {marginBottom: 15},
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

const m = defineMessages({
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
