import React, {useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {TrackEditScreenHeader} from './TrackEditScreenHeader.tsx';
import {BottomSheet} from '../../sharedComponents/BottomSheet/BottomSheet.tsx';
import PhotoIcon from '../../images/camera.svg';
import DetailsIcon from '../../images/details.svg';
import TrackIcon from '../../images/Track.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text.tsx';
import {TrackEditDescriptionField} from './TrackEditDescriptionField.tsx';
import {NavigationProp} from '@react-navigation/native';
import {TrackDiscardModal} from './TrackDiscardModal.tsx';

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
});

export const TrackEditScreen: React.FC<{navigation: NavigationProp<any>}> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const [description, setDescription] = useState('');
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const bottomSheetItems = [
    {
      icon: <PhotoIcon />,
      label: t(m.photoButton),
      onPress: () => {},
    },
    {
      icon: <DetailsIcon />,
      label: t(m.detailsButton),
      onPress: () => {},
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <TrackEditScreenHeader bottomSheetRef={bottomSheetRef} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleWrapper}>
          <TrackIcon style={styles.icon} />
          <Text style={styles.titleText}>{t(m.newTitle)}</Text>
        </View>
        <TrackEditDescriptionField
          description={description}
          setDescription={setDescription}
        />
        <TrackDiscardModal bottomSheetRef={bottomSheetRef} />
      </ScrollView>
      <BottomSheet items={bottomSheetItems} />
    </SafeAreaView>
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
