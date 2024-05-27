import React, {useCallback, useState} from 'react';
import {
  BackHandler,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {BottomSheet} from '../../sharedComponents/BottomSheet/BottomSheet.tsx';
import PhotoIcon from '../../images/camera.svg';
import DetailsIcon from '../../images/details.svg';
import TrackIcon from '../../images/Track.svg';
import {defineMessages, MessageDescriptor, useIntl} from 'react-intl';
import {Text} from '../../sharedComponents/Text.tsx';
import {TrackEditDescriptionField} from './TrackEditDescriptionField.tsx';
import {useTrackWithEnableOptionQuery} from '../../hooks/server/track.ts';
import {DiscardModal} from '../../sharedComponents/DiscardModal.tsx';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal/index.tsx';
import {useNavigationFromHomeTabs} from '../../hooks/useNavigationWithTypes.ts';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {SaveTrackButton} from './SaveTrackButton.tsx';
import DiscardIcon from '../../images/delete.svg';
import ErrorIcon from '../../images/Error.svg';
import Close from '../../images/close.svg';
import {NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {DARK_GREY} from '../../lib/styles.ts';
import {
  NativeNavigationComponent,
  RootStackParamsList,
} from '../../sharedTypes/navigation';
import {usePersistedTrack} from '../../hooks/persistedState/usePersistedTrack.ts';

const m = defineMessages({
  createTrackScreenTitle: {
    id: 'screens.SaveTrack.TrackCreateView.title',
    defaultMessage: 'New Track',
    description: 'Title for new track screen',
  },
  editTrackScreenTitle: {
    id: 'screens.SaveTrack.TrackEditView.title',
    defaultMessage: 'Edit Track',
    description: 'Title for edit track screen',
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
    id: 'Modal.DiscardTrack.discardButton',
    defaultMessage: 'Discard Track',
  },
  discardTrackDefaultButton: {
    id: 'Modal.DiscardTrack.defaultButton',
    defaultMessage: 'Continue Editing',
  },
});

export const TrackEditScreen: NativeNavigationComponent<'TrackEdit'> & {
  editTitle: MessageDescriptor;
} = ({route}) => {
  const {trackId} = route.params;
  const navigation = useNavigationFromHomeTabs();
  const clearCurrentTrack = usePersistedTrack(state => state.clearCurrentTrack);
  const {formatMessage: t} = useIntl();
  const {sheetRef, isOpen, openSheet, closeSheet} = useBottomSheetModal({
    openOnMount: false,
  });

  const {data: track} = useTrackWithEnableOptionQuery(trackId);
  const [description, setDescription] = useState<string>(
    track?.tags['notes'] ? (track.tags['notes'] as string) : '',
  );

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

  const handleDiscard = () => {
    closeSheet();
    navigation.navigate('Map');
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
        headerRight: () => <SaveTrackButton description={description} />,
      });
    }, [description, navigation, openSheet]),
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
    <SafeAreaView style={styles.container}>
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
              onPress: closeSheet,
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

TrackEditScreen.navTitle = m.createTrackScreenTitle;
TrackEditScreen.editTitle = m.editTrackScreenTitle;

export const trackEditNavigationOptions = ({
  intl,
  route,
}: {
  intl: (title: MessageDescriptor) => string;
  route: RouteProp<RootStackParamsList, 'TrackEdit'>;
}) => {
  return (): NativeStackNavigationOptions => {
    const trackId = route.params?.trackId;
    return {
      headerTitle: trackId
        ? intl(m.editTrackScreenTitle)
        : intl(m.createTrackScreenTitle),
      headerTintColor: DARK_GREY,
    };
  };
};

const styles = StyleSheet.create({
  icon: {width: 30, height: 30, marginRight: 10},
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
