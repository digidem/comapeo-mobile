import React, {FC, useCallback, useEffect} from 'react';
import {Linking} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import AudioPermission from '../images/observationEdit/AudioPermission.svg';
import {BottomSheetModalContent, BottomSheetModal} from './BottomSheetModal';
import {Audio} from 'expo-av';
import {useNavigationFromRoot} from '../hooks/useNavigationWithTypes';
import {PermissionStatus} from 'expo-av/build/Audio';

const handleRequestPermissions = (): void => {
  Audio.requestPermissionsAsync().catch(() => {});
};

const handleOpenSettings = () => {
  Linking.openSettings();
};

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
    navigation.navigate('Home', {screen: 'Map'});
  }, [closeSheet, navigation]);

  const isPermissionGranted = Boolean(permissionResponse?.granted);

  useEffect(() => {
    if (isPermissionGranted) handlePermissionGranted();
  }, [isPermissionGranted, handlePermissionGranted]);

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
      fullScreen
      ref={sheetRef}
      onDismiss={closeSheet}
      isOpen={isOpen}>
      <BottomSheetModalContent
        icon={<AudioPermission />}
        title={t(m.title)}
        description={t(m.description)}
        buttonConfigs={[
          {
            variation: 'outlined',
            onPress: closeSheet,
            text: t(m.notNowButtonText),
          },
          {
            variation: 'filled',
            onPress: onPressActionButton,
            text: actionButtonText,
          },
        ]}
      />
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
