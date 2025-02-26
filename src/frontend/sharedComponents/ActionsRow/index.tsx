import React from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Divider} from '../Divider';
import {KeyboardAccessory} from './KeyboardAccessory';
import {useKeyboardListener} from '../../hooks/useKeyboardListener';
import {defineMessages, useIntl} from 'react-intl';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes';
import PhotoIcon from '../../images/observationEdit/Photo.svg';
import AudioIcon from '../../images/observationEdit/Audio.svg';
import DetailsIcon from '../../images/observationEdit/Details.svg';
import {Preset} from '@comapeo/schema';
import {HeaderText} from '../Text/HeaderText';
import {CustomCircleIcon} from './CustomCircleIcon';
import {useFocusEffect} from '@react-navigation/native';

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

export function ActionsRow({fieldRefs}: {fieldRefs?: Preset['fieldRefs']}) {
  const {keyboardVisible} = useKeyboardListener();
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const [audioPermission, setAudioPermission] =
    React.useState<Audio.PermissionResponse | null>(null);

  // Audio permissions are granted on a different page. Since this page stays in the navigation stack,
  // it does not remount when permissions change, leading to stale permission data.
  // To ensure we always have the latest permission status, we check it whenever the page comes into focus.
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const permission = await Audio.getPermissionsAsync();
        setAudioPermission(permission);
      })();
    }, []),
  );

  const handleCameraPress = () => {
    navigation.navigate('AddPhoto');
  };
  const handleDetailsPress = () => {
    navigation.navigate('ObservationFields', {question: 1});
  };
  const handleAudioPress = () => {
    if (audioPermission === null) return;
    if (audioPermission.granted) {
      navigation.navigate('AudioRecording');
      return;
    }
    navigation.navigate('AudioAskPermissionBottomSheet', {audioPermission});
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
      <Divider />
      {keyboardVisible ? (
        <KeyboardAccessory
          items={bottomSheetItems}
          onPress={() => Keyboard.dismiss()}
        />
      ) : (
        <View style={[styles.container, styles.containerPadding]}>
          {bottomSheetItems.map(item => (
            <TouchableOpacity
              onPress={item.onPress}
              style={styles.itemContainer}
              key={item.testID}
              testID={item.testID}>
              <View style={styles.itemIcon}>
                <CustomCircleIcon icon={item.icon} />
              </View>
              <HeaderText variant="header6" numberOfLines={1}>
                {item.label}
              </HeaderText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  containerPadding: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  itemIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
