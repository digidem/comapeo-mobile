import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';
import {View, Text, StyleSheet, Linking, AppState} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import AudioPermission from '../images/observationEdit/AudioPermission.svg';
import {BLACK, COMAPEO_BLUE, WHITE} from '../lib/styles';
import {BottomSheetModal} from './BottomSheetModal';
import {Button} from './Button';
import {Audio} from 'expo-av';
import {PermissionStatus, PermissionResponse} from 'expo-av/build/Audio';

const handleOpenSettings = () => {
  Linking.openSettings();
};

interface PermissionAudio {
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  closeSheet: () => void;
  isOpen: boolean;
  permissionData: PermissionResponse | null;
  setPermissionData: Dispatch<SetStateAction<Audio.PermissionResponse | null>>;
}

export const PermissionAudio: FC<PermissionAudio> = props => {
  const {sheetRef, closeSheet, isOpen, permissionData, setPermissionData} =
    props;
  const {formatMessage: t} = useIntl();

  const handlePermissionGranted = useCallback(() => {
    closeSheet();
    //TODO:Navigate to specific screen
    // navigation.navigate('Home', {screen: 'Map'});
  }, [closeSheet]);

  const handlePermissionNotGranted = useCallback(async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermissionData(response);
    if (response.granted) {
      handlePermissionGranted();
    }
  }, [handlePermissionGranted, setPermissionData]);

  const handlePermission = useCallback(async () => {
    if (permissionData?.granted) {
      handlePermissionGranted();
    } else if (
      permissionData?.status === PermissionStatus.DENIED &&
      !permissionData.canAskAgain
    ) {
      handleOpenSettings();
    } else if (permissionData?.status !== PermissionStatus.GRANTED) {
      handlePermissionNotGranted();
    }
  }, [handlePermissionGranted, handlePermissionNotGranted, permissionData]);

  useEffect(() => {
    const subscription = AppState.addEventListener('focus', () =>
      Audio.getPermissionsAsync().then(permission => {
        setPermissionData(permission);
        if (permission.granted) handlePermissionGranted();
      }),
    );
    return () => subscription.remove();
  }, [handlePermissionGranted, setPermissionData]);

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
          <Button onPress={handlePermission} fullWidth>
            <Text style={styles.allowPermissionButtonText}>
              {permissionData?.status === 'denied' &&
              !permissionData.canAskAgain
                ? t(m.goToSettingsButtonText)
                : t(m.allowButtonText)}
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
