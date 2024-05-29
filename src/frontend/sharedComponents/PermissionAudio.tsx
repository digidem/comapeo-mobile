import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import AudioPermission from '../images/observationEdit/AudioPermission.svg';
import {BLACK, COMAPEO_BLUE, WHITE} from '../lib/styles';
import {BottomSheetModal} from './BottomSheetModal';
import {Button} from './Button';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';

import {Audio} from 'expo-av';
import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {FC, useCallback, useEffect} from 'react';
import {PermissionStatus} from 'expo-av/build/Audio/Recording';

interface PermissionAudio {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  closeSheet: () => void;
  isOpen: boolean;
}

export const PermissionAudio: FC<PermissionAudio> = props => {
  const {sheetRef, closeSheet, isOpen} = props;
  const {formatMessage: t} = useIntl();
  const navigation = useNavigationFromRoot();
  const [permissionResponse] = Audio.usePermissions({request: false});

  const handlePermissionGranted = useCallback(() => {
    closeSheet();
    navigation.navigate('Audio', {screen: 'PrepareRecording'});
  }, [closeSheet, navigation]);

  const isPermissionGranted = Boolean(permissionResponse?.granted);

  const handleRequestPermissions = (): void => {
    Audio.requestPermissionsAsync().catch(() => {});
  };
  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    if (isPermissionGranted && isOpen) handlePermissionGranted();
  }, [isOpen, isPermissionGranted, handlePermissionGranted]);

  let onPressActionButton: () => void;
  let actionButtonText: string;
  switch (permissionResponse?.status) {
    case undefined:
    case PermissionStatus.UNDETERMINED:
      onPressActionButton = handleOpenSettings;
      actionButtonText = t(m.allowButtonText);
      break;
    case PermissionStatus.DENIED:
      if (permissionResponse.canAskAgain) {
        onPressActionButton = handleOpenSettings;
        actionButtonText = t(m.allowButtonText);
      } else {
        onPressActionButton = handleRequestPermissions;
        actionButtonText = t(m.goToSettingsButtonText);
      }
      break;
    case PermissionStatus.GRANTED:
      onPressActionButton = handlePermissionGranted;
      actionButtonText = t(m.allowButtonText);
      break;
    default:
      throw new Error('Unexpected permission response');
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      fullHeight
      onDismiss={closeSheet}
      isOpen={isOpen}>
      <View style={styles.container}>
        <View style={styles.mainWrapper}>
          <AudioPermission />
          <Text style={styles.title}>{t(m.title)}</Text>
          <Text style={styles.description}>{t(m.description)}</Text>
        </View>
        <View style={styles.buttonsWrapper}>
          <Button onPress={closeSheet} variant="outlined" fullWidth>
            <Text style={styles.notNowButtonText}>{t(m.notNowButtonText)}</Text>
          </Button>
          <Button onPress={onPressActionButton} fullWidth>
            <Text style={styles.allowPermissionButtonText}>
              {actionButtonText}
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
};

const m = defineMessages({
  title: {
    id: 'screens.AudioPermission.title',
    defaultMessage: 'Recording Audio with CoMapeo',
    description: 'Screen title for audio permission screen',
  },
  description: {
    id: 'screens.AudioPermission.description',
    defaultMessage:
      'To record audio while using the app and in the background CoMapeo needs to access your microphone.',
    description: 'Screen description for audio permission screen',
  },
  notNowButtonText: {
    id: 'screens.AudioPermission.Button.notNow',
    defaultMessage: 'Not Now',
    description: 'Screen button text for not allowed audio permission',
  },
  allowButtonText: {
    id: 'screens.AudioPermission.Button.allow',
    defaultMessage: 'Allow',
    description: 'Screen button text for allow the audio permission',
  },
  goToSettingsButtonText: {
    id: 'screens.AudioPermission.Button.goToSettings',
    defaultMessage: 'Go to Settings',
    description:
      'Screen button text for navigate user to settings when audio permission was denied',
  },
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
  },
  mainWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: BLACK,
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    width: '65%',
    textAlign: 'center',
    marginTop: 20,
  },
  description: {
    fontSize: 16,
    color: BLACK,
    alignSelf: 'center',
    marginTop: 40,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  buttonsWrapper: {
    gap: 20,
    paddingHorizontal: 40,
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  notNowButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: COMAPEO_BLUE,
  },
  allowPermissionButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: WHITE,
  },
});
