import * as React from 'react';
import {defineMessages, useIntl} from 'react-intl';
import {
  StyleSheet,
  TextInput,
  View,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import * as Sentry from '@sentry/react-native';
import {NativeNavigationComponent} from '../../sharedTypes/navigation';
import {
  BLACK,
  BLUE_GREY,
  DARK_GREY,
  NEW_DARK_GREY,
  RED,
} from '../../lib/styles';
import {DestructiveButton} from '../../sharedComponents/Buttons';
import {ScreenContentWithDock} from '../../sharedComponents/ScreenContentWithDock';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProject} from '../../contexts/ActiveProjectContext';
import {useProjectSettings, useRemoveMember} from '@comapeo/core-react';
import Ionicons from '@react-native-vector-icons/ionicons';

const m = defineMessages({
  title: {
    id: 'screens.YourTeam.RemoveDevice.title',
    defaultMessage: 'Remove Device',
  },
  reasonLabel: {
    id: 'screens.YourTeam.RemoveDevice.reasonLabel',
    defaultMessage: 'Reason for removal?',
  },
  removeAndNotifyButton: {
    id: 'screens.YourTeam.RemoveDevice.removeAndNotifyButton',
    defaultMessage: 'Remove & Notify',
  },
});

export const RemoveDevice: NativeNavigationComponent<'RemoveDevice'> = ({
  navigation,
  route,
}) => {
  const {formatMessage: t} = useIntl();
  const {deviceId, deviceName} = route.params;
  const {projectId} = useActiveProject();
  const {data: projectSettings} = useProjectSettings({projectId});
  const [reason, setReason] = React.useState('');
  const [errorTimeout, setErrorTimeout] = useTemporaryError();
  const maxReasonLength = 100;

  const removeMemberMutation = useRemoveMember({projectId});

  function setReasonWithValidation(reasonValue: string) {
    if (reasonValue.length > maxReasonLength) {
      setErrorTimeout();
      return;
    }
    setReason(reasonValue);
  }

  const handleRemoveDevice = () => {
    const trimmedReason = reason.trim();

    removeMemberMutation.mutate(
      {
        deviceId: deviceId,
        ...(trimmedReason && {reason: trimmedReason}),
      },
      {
        onSuccess: () => {
          if (projectSettings.name) {
            navigation.replace('DeviceRemovedSuccess', {
              deviceName,
              projectName: projectSettings.name,
            });
          }
        },
        onError: error => {
          Sentry.captureException(error);
          navigation.navigate('ErrorBottomSheet');
        },
      },
    );
  };

  return (
    <ScreenContentWithDock
      dockContent={
        <DestructiveButton
          fullSize
          text={t(m.removeAndNotifyButton)}
          onPress={handleRemoveDevice}
          renderIcon={({color, size}) => (
            <Ionicons size={size} color={color} name="person-remove-outline" />
          )}
        />
      }
      contentContainerStyle={styles.content}>
      <View style={styles.reasonSection}>
        <BodyText style={styles.reasonLabel} variant="smallMeta">
          {t(m.reasonLabel)}
        </BodyText>
        <TextInput
          style={[
            styles.reasonInput,
            {borderColor: errorTimeout ? RED : BLUE_GREY},
          ]}
          value={reason}
          onChangeText={setReasonWithValidation}
          placeholderTextColor={NEW_DARK_GREY}
          multiline
        />
        <BodyText
          style={RNStyleSheet.flatten([
            styles.characterCount,
            {color: errorTimeout ? RED : NEW_DARK_GREY},
          ])}
          variant="smallMeta">
          {reason.length}/{maxReasonLength}
        </BodyText>
      </View>
    </ScreenContentWithDock>
  );
};

RemoveDevice.navTitle = m.title;

function useTemporaryError() {
  const [errorTimeout, setErrorTimeout] = React.useState(false);
  const timer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  React.useEffect(() => {
    if (errorTimeout && !timer.current) {
      timer.current = setTimeout(() => {
        setErrorTimeout(false);
        timer.current = undefined;
      }, 1500);
    }

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };
  }, [errorTimeout]);

  return [
    errorTimeout,
    () => setErrorTimeout(prevVal => (!prevVal ? true : prevVal)),
  ] as const;
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 24,
  },
  reasonSection: {
    gap: 6,
  },
  reasonLabel: {
    color: DARK_GREY,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: BLUE_GREY,
    borderRadius: 4,
    padding: 15,
    minHeight: 150,
    textAlignVertical: 'top',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontSize: 16,
    color: BLACK,
  },
  characterCount: {
    textAlign: 'right',
  },
});
