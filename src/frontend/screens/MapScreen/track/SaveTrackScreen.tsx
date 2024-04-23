import React, {useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {SaveTrackHeader} from './saveTrack/SaveTrackHeader';
import {DiscardTrackModal} from './saveTrack/DiscardTrackModal';
import {BottomSheet} from '../../../sharedComponents/BottomSheet/BottomSheet';
import PhotoIcon from '../../../images/camera.svg';
import DetailsIcon from '../../../images/details.svg';
import TrackIcon from '../../../images/Track.svg';
import {defineMessages, useIntl} from 'react-intl';
import {Text} from '../../../sharedComponents/Text';
import {TrackDescriptionField} from './saveTrack/TrackDescriptionField';
import {NavigationProp} from '@react-navigation/native';

const m = defineMessages({
  editTitle: {
    id: 'screens.ObservationEdit.editTitle',
    defaultMessage: 'Edit Observation',
    description: 'screen title for edit observation screen',
  },
  newTitle: {
    id: 'screens.ObservationEdit.newTitle',
    defaultMessage: 'New Observation',
    description: 'screen title for new observation screen',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.saveTrackDetails',
    defaultMessage: 'Details',
    description: 'Button label for check details',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.saveTrackCamera',
    defaultMessage: 'Camera',
    description: 'Button label for adding photo',
  },
});

export const SaveTrackScreen: React.FC<{navigation: NavigationProp<any>}> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const [description, setDescription] = useState('');
  const bottomSheetRef = useRef<BottomSheetModal>(null);

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
  return (
    <SafeAreaView style={styles.container}>
      <SaveTrackHeader bottomSheetRef={bottomSheetRef} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.titleWrapper}>
          <TrackIcon style={styles.icon} />
          <Text style={styles.titleText}>Track</Text>
        </View>
        <TrackDescriptionField
          description={description}
          setDescription={setDescription}
        />
        <DiscardTrackModal bottomSheetRef={bottomSheetRef} />
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
