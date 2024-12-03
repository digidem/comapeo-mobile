import React, {FC, useEffect, useRef} from 'react';
import {Linking, View, AppState, AppStateStatus} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../../images/observationEdit/AudioPermission.svg';
import {BottomSheetModalContent} from '../../sharedComponents/BottomSheetModal';
import {Audio} from 'expo-av';

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

interface PermissionAudioBottomSheetContentProps {
  closeSheet: () => void;
  setShouldNavigateToAudioTrue: () => void;
  permissionStatus: Audio.PermissionStatus | null;
  isOpen: boolean;
}

export const PermissionAudioBottomSheetContent: FC<
  PermissionAudioBottomSheetContentProps
> = ({closeSheet, setShouldNavigateToAudioTrue, permissionStatus, isOpen}) => {
  const {formatMessage: t} = useIntl();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isOpen) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        const {status} = await Audio.getPermissionsAsync();
        if (status === 'granted') {
          closeSheet();
          setShouldNavigateToAudioTrue();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [isOpen, closeSheet, setShouldNavigateToAudioTrue]);

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleRequestPermission = async () => {
    const response = await Audio.requestPermissionsAsync();
    closeSheet();
    if (response.status === 'granted') {
      setShouldNavigateToAudioTrue();
    } else if (response.status === 'denied' && !response.canAskAgain) {
      handleOpenSettings();
    }
  };

  const onPressActionButton =
    !permissionStatus || permissionStatus === 'undetermined'
      ? handleRequestPermission
      : permissionStatus === 'denied'
        ? handleOpenSettings
        : handleRequestPermission;
  const actionButtonText =
    !permissionStatus || permissionStatus === 'undetermined'
      ? t(m.allowButtonText)
      : permissionStatus === 'denied'
        ? t(m.goToSettingsButtonText)
        : t(m.allowButtonText);

  return (
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
  );
};
