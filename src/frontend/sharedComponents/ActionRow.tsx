import React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {ActionTab} from './ActionTab';
import PhotoIcon from '../images/observationEdit/Photo.svg';
import AudioIcon from '../images/observationEdit/Audio.svg';
import DetailsIcon from '../images/observationEdit/Details.svg';
import {useNavigation} from '@react-navigation/native';
import {Preset} from '@comapeo/schema';
import {Audio} from 'expo-av';
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
}
export const ActionsRow = ({fieldRefs}: ActionButtonsProps) => {
  const {formatMessage: t} = useIntl();
  const navigation = useNavigation<ObservationCreateNavigationProp>();
  const [audioPermission] = Audio.usePermissions();

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };
  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };
  const handleAudioPress = () => {
    if (audioPermission === null) return;
    if (audioPermission.granted) {
      navigation.navigate('Audio', {isEditing: false});
      return;
    }
    navigation.navigate('AudioPermissionWarningBottomSheet', {audioPermission});
  };

  const bottomSheetItems = [
    {
      icon: <AudioIcon width={30} height={30} />,
      label: t(m.audioButton),
      onPress: handleAudioPress,
      testID: 'OBS.add-audio-btn',
    },
    {
      icon: <PhotoIcon width={30} height={30} />,
      label: t(m.photoButton),
      onPress: handleCameraPress,
      testID: 'OBS.add-photo-btn',
    },
  ];

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
    </>
  );
};
