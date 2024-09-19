import React, {FC, useEffect} from 'react';
import {Linking} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../images/observationEdit/AudioPermission.svg';
import {BottomSheetModalContent, BottomSheetModal} from './BottomSheetModal';
import {Audio} from 'expo-av';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

const m = defineMessages({
  title: {
    id: 'screens.AudioPermission.title',
    defaultMessage: 'Recording Audio with CoMapeo',
    description: 'Screen title for audio permission screen',
  },
  description: {
    id: 'screens.AudioPermission.description',
    defaultMessage:
      'To record audio while using the app and in the background CoMapeo needs to access your microphone. Please enable microphone permissions in your app settings.',
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
interface PermissionAudioProps {
  closeSheet: () => void;
  isOpen: boolean;
  sheetRef: React.RefObject<BottomSheetModalMethods>;
  onPermissionGranted: () => void;
}

export const PermissionAudio: FC<PermissionAudioProps> = ({
  closeSheet,
  isOpen,
  sheetRef,
  onPermissionGranted,
}) => {
  const {formatMessage: t} = useIntl();
  const [permissionResponse, requestPermission] = Audio.usePermissions({
    request: false,
  });

  useEffect(() => {
    if (isOpen && permissionResponse?.status === 'granted') {
      onPermissionGranted();
    }
  }, [isOpen, permissionResponse, onPermissionGranted]);

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleRequestPermission = async () => {
    const response = await requestPermission();
    if (response.status === 'granted') {
      onPermissionGranted();
    } else if (!response.canAskAgain) {
      handleOpenSettings();
    }
  };

  let onPressActionButton: () => void;
  let actionButtonText: string;

  if (
    permissionResponse?.status === 'denied' &&
    !permissionResponse.canAskAgain
  ) {
    onPressActionButton = handleOpenSettings;
    actionButtonText = t(m.goToSettingsButtonText);
  } else {
    onPressActionButton = handleRequestPermission;
    actionButtonText = t(m.allowButtonText);
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      isOpen={isOpen}
      onDismiss={closeSheet}
      fullScreen>
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
