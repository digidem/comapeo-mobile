import * as React from 'react';
import {BottomSheetWrapper} from '../../sharedComponents/BottomSheetWrapper';
import {AppState, StyleSheet, View} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import AudioPermission from '../../images/observationEdit/AudioPermission.svg';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  PermissionResponse,
} from 'expo-audio';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {openSettingsAndWait} from '../../utils/linking';
import {PrimaryButton, SecondaryButton} from '../../sharedComponents/Buttons';
import {useAudioPermissionModalMutation} from '../../hooks/useAudioPermissionTracker';
import {useSecurityState} from '../../contexts/SecurityStoreContext';
import {useCustomSafeAreaInsets} from '../../hooks/useCustomSafeAreaInsets';

const m = defineMessages({
  title: {
    id: '$1screens.AudioPermission.title',
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
    id: '$1screens.AudioPermission.Button.notNow',
    defaultMessage: 'Not Now',
    description: 'Screen button text for not granting audio permission',
  },
  allowButtonText: {
    id: '$1screens.AudioPermission.Button.allow',
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
  const [permission, setPermission] = React.useState<PermissionResponse>(
    route.params.audioPermission,
  );
  const hasNavigatedRef = React.useRef(false);
  const {passcode} = useSecurityState();
  // this screen has no header, so we need to push the content down below the notch.
  const {top} = useCustomSafeAreaInsets();

  // Re-check microphone permission in case it was granted via system settings,
  // and navigate to AudioRecording if so.
  const checkAndNavigateIfGranted = React.useCallback(() => {
    getRecordingPermissionsAsync().then((newPermission: PermissionResponse) => {
      setPermission(newPermission);
      if (newPermission.status === 'granted' && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        replace('AudioRecording');
      }
    });
  }, [replace]);

  // We need *both* the AppState listener and the useFocusEffect because passcode being active shifts the timing.
  //
  // In the no-passcode flow, the app becomes "active" *after* returning from settings —
  // so the AppState change is enough to detect permission changes.
  //
  // But in the passcode flow, the app becomes "active" *before* the user finishes authenticating.
  // So we use useFocusEffect to re-check permissions after the user actually lands back on this screen.
  //
  // Without both, we’d miss the permission change in one of the two flows.

  // Covers re-entering from Auth screen (passcode is active flow)
  useFocusEffect(
    React.useCallback(() => {
      if (passcode && permission.status !== 'granted') {
        checkAndNavigateIfGranted();
      }
    }, [checkAndNavigateIfGranted, permission.status, passcode]),
  );

  // Covers non-passcode flow from system settings
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (!passcode && state === 'active') checkAndNavigateIfGranted();
    });
    return () => subscription.remove();
  }, [checkAndNavigateIfGranted, passcode]);

  const askPermissionMutation = useAudioPermissionModalMutation(async () => {
    const response = await requestRecordingPermissionsAsync();
    setPermission(response);
    if (response.granted) {
      replace('AudioRecording');
      return;
    }
  });

  const goToSettingsMutation = useAudioPermissionModalMutation(async () => {
    await openSettingsAndWait();
    checkAndNavigateIfGranted();
  });

  return (
    <BottomSheetWrapper>
      {/* This padding is a litte weird. this should have a padding of 80 from the top
        40 of the padding comes from bottom sheet wrapper, plus this 40, plus the 
        inset for th top notch */}
      <View style={[styles.container, {paddingTop: top + 40}]}>
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
          style={{width: '100%', gap: 15, alignItems: 'center', marginTop: 30}}>
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
          <SecondaryButton
            fullSize
            text={formatMessage(m.notNowButtonText)}
            onPress={goBack}
          />
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
