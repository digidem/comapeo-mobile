import React, {useCallback, useEffect, useState} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ActionTab} from './ActionTab';
import PhotoIcon from '../images/observationEdit/Photo.svg';
import AudioIcon from '../images/observationEdit/Audio.svg';
import DetailsIcon from '../images/observationEdit/Details.svg';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {Preset} from '@comapeo/schema';
import {PermissionAudio} from './PermissionAudio';
import {Audio} from 'expo-av';
import {useBottomSheetModal} from '../sharedComponents/BottomSheetModal';

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

interface ActionButtonsProps {
  fieldRefs?: Preset['fieldRefs'];
}

export const ActionsRow = ({fieldRefs}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();

  const [permissionResponse] = Audio.usePermissions();
  const [hasNavigatedToAudio, setHasNavigatedToAudio] = useState(false);
  const {
    openSheet: openAudioPermissionSheet,
    sheetRef: audioPermissionSheetRef,
    closeSheet: closeAudioPermissionSheet,
    isOpen: isAudioPermissionSheetOpen,
  } = useBottomSheetModal({
    openOnMount: false,
  });

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };

  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };

  const handleAudioPress = useCallback(() => {
    if (permissionResponse?.status === 'granted') {
      if (!hasNavigatedToAudio) {
        setHasNavigatedToAudio(true); // Only set to true when actually navigating
        console.log('should be navigating to audio');
        navigation.navigate('Audio');
      }
    } else {
      console.log('openAudioPermissionSheet IS BEING CALLED');
      if (audioPermissionSheetRef.current) {
        audioPermissionSheetRef.current.present();
      } else {
        openAudioPermissionSheet();
      }
    }
  }, [
    navigation,
    permissionResponse,
    hasNavigatedToAudio,
    openAudioPermissionSheet,
    audioPermissionSheetRef,
  ]);

  useEffect(() => {
    setHasNavigatedToAudio(false);
  }, []);

  useEffect(() => {
    // Optional: If you need to track specific navigation events, you could do so here
    const unsubscribe = navigation.addListener('blur', () => {
      // Optionally reset on 'blur', when the screen is no longer focused
      setHasNavigatedToAudio(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handlePermissionGranted = () => {
    if (audioPermissionSheetRef.current) {
      console.log('calling handle permission granted');
      closeAudioPermissionSheet();
      audioPermissionSheetRef.current.close();
    }
    if (!hasNavigatedToAudio) {
      console.log(
        'setting hasNavigatedToAudio to true and then navigate to audio',
      );
      setHasNavigatedToAudio(true); // Only set to true when actually navigating
      navigation.navigate('Audio');
    }
  };

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
    // Only show the option to add details if preset fields are defined.
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
      <PermissionAudio
        closeSheet={closeAudioPermissionSheet}
        isOpen={isAudioPermissionSheetOpen}
        sheetRef={audioPermissionSheetRef}
        onPermissionGranted={handlePermissionGranted}
      />
    </>
  );
};
