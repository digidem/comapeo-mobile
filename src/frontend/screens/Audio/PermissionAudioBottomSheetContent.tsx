import React, {FC, useState} from 'react';
import {Linking, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../../images/observationEdit/AudioPermission.svg';
import {BottomSheetModalContent} from '../../sharedComponents/BottomSheetModal';
import {Audio} from 'expo-av';
import {PermissionResponse} from 'expo-modules-core';

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
}

export const PermissionAudioBottomSheetContent: FC<
  PermissionAudioBottomSheetContentProps
> = ({closeSheet, setShouldNavigateToAudioTrue}) => {
  const {formatMessage: t} = useIntl();
  const [permissionResponse, setPermissionResponse] =
    useState<PermissionResponse | null>(null);

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  const handleRequestPermission = async () => {
    const response = await Audio.requestPermissionsAsync();
    closeSheet();
    setPermissionResponse(response);
    if (response.status === 'granted') {
      setShouldNavigateToAudioTrue();
    } else if (response.status === 'denied' && !response.canAskAgain) {
      handleOpenSettings();
    }
  };

  const onPressActionButton = !permissionResponse
    ? handleRequestPermission
    : permissionResponse.status === 'denied'
      ? handleOpenSettings
      : handleRequestPermission;
  const actionButtonText = !permissionResponse
    ? t(m.allowButtonText)
    : permissionResponse.status === 'denied'
      ? t(m.goToSettingsButtonText)
      : t(m.allowButtonText);

  return (
    <View style={{paddingTop: 80}}>
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
    </View>
  );
};
