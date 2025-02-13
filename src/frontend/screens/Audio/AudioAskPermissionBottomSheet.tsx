import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {
  AppState,
  AppStateStatus,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../../images/observationEdit/AudioPermission.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {Button} from '../../sharedComponents/Button';
import {Audio} from 'expo-av';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

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

  // When the user changes their permission in phone settings and returns to the app,
  // we need to check for updates and navigate accordingly.
  // Without this, the app won't detect the permission change.
  React.useEffect(() => {
    let isCancelled = false;
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const newPermission = await Audio.getPermissionsAsync();
        if (isCancelled) return;
        setPermission(newPermission);
        if (newPermission.status === 'granted') {
          replace('AudioRecording');
        }
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      isCancelled = true;
      subscription.remove();
    };
  }, [replace]);

  async function askPermission() {
    const response = await Audio.requestPermissionsAsync();
    setPermission(response);
    if (response.granted) {
      replace('AudioRecording');
      return;
    }
  }

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
        <View style={{width: '100%'}}>
          <Button fullWidth variant="outlined" onPress={goBack}>
            {formatMessage(m.notNowButtonText)}
          </Button>
          {permission.canAskAgain ? (
            <Button fullWidth onPress={askPermission} style={{marginTop: 20}}>
              {formatMessage(m.allowButtonText)}
            </Button>
          ) : (
            <Button
              fullWidth
              onPress={() => Linking.openSettings()}
              style={{marginTop: 20}}>
              {formatMessage(m.goToSettingsButtonText)}
            </Button>
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
