import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {Linking, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../../images/observationEdit/AudioPermission.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Audio} from 'expo-av';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {useAudioPermissionModalMutation} from '../../hooks/useAudioPermissionTracker';

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
    description: 'Screen button text for not granting audio permission',
  },
  allowButtonText: {
    id: 'screens.AudioPermission.Button.allow',
    defaultMessage: 'Allow',
    description: 'Screen button text for granting the audio permission',
  },
  goToSettingsButtonText: {
    id: 'screens.AudioPermission.Button.goToSettings',
    defaultMessage: 'Go to Settings',
    description:
      'Screen button text for navigating the user to settings when audio permission is denied',
  },
});

export const AudioAskPermissionBottomSheet = ({
  navigation,
  route,
}: NativeRootNavigationProps<'AudioAskPermissionBottomSheet'>) => {
  const {formatMessage} = useIntl();
  const {goBack, replace} = navigation;
  const [permission, setPermission] = React.useState<Audio.PermissionResponse>(
    route.params.audioPermission,
  );
  const hasNavigatedRef = React.useRef(false);

  // Re-check microphone permission on focus in case it was granted via system settings,
  // and navigate to AudioRecording if so.
  useFocusEffect(
    React.useCallback(() => {
      const checkAndNavigate = async () => {
        const newPermission = await Audio.getPermissionsAsync();
        setPermission(newPermission);

        if (newPermission.status === 'granted' && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          replace('AudioRecording');
        }
      };

      checkAndNavigate();
    }, [replace]),
  );

  const askPermissionMutation = useAudioPermissionModalMutation(async () => {
    const response = await Audio.requestPermissionsAsync();
    setPermission(response);
    if (response.granted) {
      replace('AudioRecording');
      return;
    }
  });

  const goToSettingsMutation = useAudioPermissionModalMutation(() =>
    Linking.openSettings(),
  );

  return (
    <BottomSheetWrapper>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <AudioPermission />
          <HeaderText
            variant="header2"
            style={{marginTop: 20, textAlign: 'center'}}>
            {formatMessage(m.title)}
          </HeaderText>
          <BodyText style={{marginTop: 10, textAlign: 'center'}}>
            {formatMessage(m.description)}
          </BodyText>
        </View>
        <View
          style={{width: '100%', gap: 20, alignItems: 'center', marginTop: 30}}>
          <SecondaryButton
            fullSize
            text={formatMessage(m.notNowButtonText)}
            onPress={goBack}
          />
          {permission.canAskAgain ? (
            <PrimaryButton
              fullSize
              text={formatMessage(m.allowButtonText)}
              onPress={() => askPermissionMutation.mutateAsync()}
            />
          ) : (
            <PrimaryButton
              fullSize
              text={formatMessage(m.goToSettingsButtonText)}
              onPress={() => goToSettingsMutation.mutateAsync()}
            />
          )}
        </View>
      </View>
    </BottomSheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
  },
});
