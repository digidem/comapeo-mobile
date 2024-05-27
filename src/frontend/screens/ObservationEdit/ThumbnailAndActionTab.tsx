import React, {FC, useCallback} from 'react';
import {View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {ThumbnailScrollView} from '../../sharedComponents/Thumbnail';
import {ActionTab} from '../../sharedComponents/ActionTab';
import PhotoIcon from '../../images/observationEdit/Photo.svg';
import AudioIcon from '../../images/observationEdit/Audio.svg';
import DetailsIcon from '../../images/observationEdit/Details.svg';
import {usePersistedDraftObservation} from '../../hooks/persistedState/usePersistedDraftObservation';
import {useDraftObservation} from '../../hooks/useDraftObservation';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamsList} from '../../sharedTypes/navigation';
import {useBottomSheetModal} from '../../sharedComponents/BottomSheetModal';
import {PermissionAudio} from '../../sharedComponents/PermissionAudio';
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

interface ThumbnailAndActionTab {
  navigation: NativeStackNavigationProp<
    AppStackParamsList,
    'ObservationEdit',
    undefined
  >;
}

export const ThumbnailAndActionTab: FC<ThumbnailAndActionTab> = ({
  navigation,
}) => {
  const {formatMessage: t} = useIntl();
  const {usePreset} = useDraftObservation();
  const preset = usePreset();
  const {photos, audioRecordings, observationId} = usePersistedDraftObservation(
    store => store,
  );
  const {
    openSheet: openAudioPermissionSheet,
    sheetRef: audioPermissionSheetRef,
    isOpen: isAudioPermissionSheetOpen,
    closeSheet: closeAudioPermissionSheet,
  } = useBottomSheetModal({
    openOnMount: false,
  });
  const [permissionResponse] = Audio.usePermissions({request: false});

  const handleCameraPress = useCallback(() => {
    navigation.navigate('AddPhoto');
  }, [navigation]);

  const handleDetailsPress = useCallback(() => {
    navigation.navigate('ObservationFields', {question: 1});
  }, [navigation]);

  const handleAudioPress = useCallback(() => {
    if (permissionResponse?.granted) {
      navigation.navigate('Home', {screen: 'Map'});
    } else {
      openAudioPermissionSheet();
    }
  }, [navigation, openAudioPermissionSheet, permissionResponse?.granted]);

  const bottomSheetItems = [
    {
      icon: <PhotoIcon width={30} height={30} />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
    },
  ];

  if (process.env.EXPO_PUBLIC_FEATURE_AUDIO) {
    bottomSheetItems.unshift({
      icon: <AudioIcon width={30} height={30} />,
      label: t(m.audioButton),
      onPress: handleAudioPress,
    });
  }

  if (preset?.fieldIds.length) {
    // Only show the option to add details if preset fields are defined.
    bottomSheetItems.push({
      icon: <DetailsIcon width={30} height={30} />,
      label: t(m.detailsButton),
      onPress: handleDetailsPress,
    });
  }

  return (
    <>
      <View>
        <ThumbnailScrollView
          photos={photos}
          audioRecordings={audioRecordings}
          observationId={observationId}
        />
        <ActionTab items={bottomSheetItems} />
      </View>
      <PermissionAudio
        closeSheet={closeAudioPermissionSheet}
        isOpen={isAudioPermissionSheetOpen}
        sheetRef={audioPermissionSheetRef}
      />
    </>
  );
};
