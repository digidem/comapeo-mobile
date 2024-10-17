import React, {useCallback, useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ActionTab} from './ActionTab';
import PhotoIcon from '../images/observationEdit/Photo.svg';
import AudioIcon from '../images/observationEdit/Audio.svg';
import DetailsIcon from '../images/observationEdit/Details.svg';
import {useNavigation} from '@react-navigation/native';
import {Preset} from '@comapeo/schema';
import {PermissionAudioBottomSheetContent} from '../screens/Audio/PermissionAudioBottomSheetContent';
import {Audio} from 'expo-av';
import {useBottomSheetModal} from '../sharedComponents/BottomSheetModal';
import {BottomSheetModal} from './BottomSheetModal';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../sharedTypes/navigation';

const m = defineMessages({
  audioButton: {
    id: 'screens.ObservationEdit.ObservationEditView.audioButton',
    defaultMessage: 'Audio',
    description: 'Button label for adding audio',
  },
  photoButton: {
    id: 'screens.ObservationEdit.ObservationEditView.photoButton',
    defaultMessage: 'Photo',
    description: 'Button label for adding photo',
  },
  detailsButton: {
    id: 'screens.ObservationEdit.ObservationEditView.detailsButton',
    defaultMessage: 'Details',
    description: 'Button label to add details',
  },
});

type ObservationCreateNavigationProp = NativeStackNavigationProp<
  AppStackParamsList,
  'ObservationCreate'
>;

interface ActionButtonsProps {
  fieldRefs?: Preset['fieldRefs'];
  isEditing?: boolean;
}
export const ActionsRow = ({
  fieldRefs,
  isEditing = false,
}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigation<ObservationCreateNavigationProp>();
  const {
    openSheet: openAudioPermissionSheet,
    sheetRef: audioPermissionSheetRef,
    closeSheet: closeAudioPermissionSheet,
    isOpen: isAudioPermissionSheetOpen,
  } = useBottomSheetModal({
    openOnMount: false,
  });

  const [shouldNavigateToAudio, setShouldNavigateToAudio] = useState(false);

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };
  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };

  const handleAudioPress = useCallback(async () => {
    const {status} = await Audio.getPermissionsAsync();
    if (status === 'granted') {
      navigation.navigate('Audio', {isEditing});
    } else {
      openAudioPermissionSheet();
    }
  }, [navigation, openAudioPermissionSheet]);

  const handleModalDismiss = useCallback(() => {
    if (shouldNavigateToAudio) {
      navigation.navigate('Audio', {isEditing});
      setShouldNavigateToAudio(false);
    }
  }, [shouldNavigateToAudio, navigation]);

  const bottomSheetItems = [
    {
      icon: <PhotoIcon width={30} height={30} />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
      testID: 'OBS.add-photo-btn',
    },
  ];

  if (process.env.EXPO_PUBLIC_FEATURE_AUDIO) {
    bottomSheetItems.unshift({
      icon: <AudioIcon width={30} height={30} />,
      label: t(m.audioButton),
      onPress: handleAudioPress,
      testID: 'OBS.add-audio-btn',
    });
  }
  if (fieldRefs?.length) {
    bottomSheetItems.push({
      icon: <DetailsIcon width={30} height={30} />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
      testID: 'OBS.add-details-btn',
    });
  }

  return (
    <>
      <ActionTab items={bottomSheetItems} />
      <BottomSheetModal
        ref={audioPermissionSheetRef}
        isOpen={isAudioPermissionSheetOpen}
        onDismiss={handleModalDismiss}
        fullScreen>
        <PermissionAudioBottomSheetContent
          closeSheet={closeAudioPermissionSheet}
          setShouldNavigateToAudioTrue={() => setShouldNavigateToAudio(true)}
        />
      </BottomSheetModal>
    </>
  );
};
