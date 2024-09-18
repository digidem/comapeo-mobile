import React, {useCallback} from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ActionTab} from './ActionTab';
import PhotoIcon from '../images/observationEdit/Photo.svg';
import AudioIcon from '../images/observationEdit/Audio.svg';
import DetailsIcon from '../images/observationEdit/Details.svg';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {Preset} from '@comapeo/schema';
import {useBottomSheetModal} from '../sharedComponents/BottomSheetModal';
import {PermissionAudio} from './PermissionAudio';
import {Audio} from 'expo-av';

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
  const {
    openSheet: openAudioPermissionSheet,
    sheetRef: audioPermissionSheetRef,
    isOpen: isAudioPermissionSheetOpen,
    closeSheet: closeAudioPermissionSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });
  const [permissionResponse] = Audio.usePermissions({request: false});
  const navigation = useNavigationFromRoot();

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };

  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };

  const handleAudioPress = useCallback(() => {
    if (permissionResponse?.granted) {
      navigation.navigate('Audio');
    } else {
      openAudioPermissionSheet();
    }
  }, [navigation, openAudioPermissionSheet, permissionResponse?.granted]);

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
      />
    </>
  );
};
